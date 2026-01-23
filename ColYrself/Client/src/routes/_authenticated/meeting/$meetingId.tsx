import { createFileRoute } from '@tanstack/react-router'
import * as SignalR from "@microsoft/signalr"
import { Button } from '@/components/ui/button';
import VideoBox from '@/components/video-box';
import RemoteVideo from '@/components/remote-video';
import { useEffect, useRef, useState } from 'react';
import type { User, RoomUser } from '@/types/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/meeting/$meetingId')({
  component: RouteComponent,
})

type MediaState = {
  camera: boolean;
  microphone: boolean;
}

function RouteComponent() {
  const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  const [isJoined, setIsJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [localUserMedia, setLocalUserMedia] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [peerMediaState, setPeerMediaState] = useState<Record<string, MediaState>>({});
  const [activePeers, setActivePeers] = useState<string[]>([])

  const peers = useRef<Record<string, RTCPeerConnection>>({});
  const peerData = useRef<Record<string, User>>({});
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const hub = useRef<SignalR.HubConnection | null>(null);

  const { meetingId } = Route.useParams()
  const { user } = useAuth();
  
  const micClickEvent = () => {
    const newState = !micOn
    localUserMedia?.getAudioTracks().forEach(t => {
      t.enabled = newState;
    })
    setMicOn(newState);
    hub.current?.invoke("MediaStateChanged", meetingId, JSON.stringify({
      camera: camOn,
      microphone: newState
    }));
  }

  const camClickEvent = () => {
    const newState = !camOn
    localUserMedia?.getVideoTracks().forEach(t => {
      t.enabled = newState;
    })
    setCamOn(newState);
    hub.current?.invoke("MediaStateChanged", meetingId, JSON.stringify({
      camera: newState,
      microphone: micOn
    }));
  }

  const startHub = async () => {
    try {
      await hub.current?.start();
      await hub.current?.invoke("JoinMeeting", meetingId);
    } catch(e) {
      console.error(e);
    }
  }

  const joinMeeting = async () => {
    const hubBuilder = new SignalR.HubConnectionBuilder()
        .withUrl(import.meta.env.VITE_SIGNALR_HUB)
        .withAutomaticReconnect()
        .build();
    hub.current = hubBuilder;

    hub.current?.on("ActiveUsers", async (users: RoomUser[]) => {
      console.log("Get active users", users);
      setActivePeers(users.map(x => x.connectionId));
      for(const user of users) {
        peerData.current[user.connectionId] = {
          id: user.userId,
          username: user.username,
          email: ""
        }
      }
    })

    hub.current?.on("UserJoined", async (newUser: User, connectionId: string) => {
      const pc = createPeer(hub.current, connectionId)
      peerData.current[connectionId] = newUser;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await hub.current?.invoke("SendOffer", connectionId, JSON.stringify(offer))
      setActivePeers(prev => [...new Set([...prev, connectionId])]);
      toast.success(`${newUser.username} joined the meeting`);
    })
    
    hub.current?.on("ReceiveOffer", async (connectionId: string, offer: string) => {
      console.log("Received offer from", connectionId)
      const pc = createPeer(hub.current, connectionId);
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await hub.current?.invoke("SendAnswer", connectionId, JSON.stringify(answer));
    })

    hub.current?.on("ReceiveAnswer", async (connectionId: string, answer: string) => {
      console.log("Received answer from", connectionId);
      const pc = createPeer(hub.current, connectionId);
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
    })

    hub.current?.on("ReceiveIceCandidate", async (connectionId: string, candidate: string) => {
      console.log("Received ice candidate from", connectionId);
      const pc = createPeer(hub.current, connectionId);
      await pc.addIceCandidate(JSON.parse(candidate));
    })

    hub.current?.on("UserMediaStateChanged", async (connectionId: string, stateChange: string) => {
      const state = JSON.parse(stateChange) as MediaState
      setPeerMediaState(prev => ({
        ...prev,
        [connectionId]: state
      }))
    })

    hub.current?.on("UserLeft", async (user: User, connectionId: string) => {
      toast.info(`${user.username} left the meeting`);
      setActivePeers(prev => {
        const filtered = prev.filter(x => x !== connectionId);
        return filtered;
      });
      setPeerMediaState(prev => {
        const cp = {...prev};
        delete cp[connectionId];
        return cp;
      })
      peers.current[connectionId].close()
      delete peers.current[connectionId];
    })

    await startHub()
    setIsJoined(true);
  }

  const leaveMeeting = async () => {
    await hub.current?.invoke("LeaveMeeting", meetingId);
    setIsJoined(false);
    setRemoteStreams({});
    setPeerMediaState({});
    setActivePeers([]);
    peerData.current = {};
    peers.current = {}
  }

  const createPeer = (hub: SignalR.HubConnection | null, connectionId: string) => {
    const foundPeer = peers.current[connectionId];
    if(foundPeer) return foundPeer;
    console.log("Creating peer connection");
    const pc = new RTCPeerConnection(config);
    localUserMedia?.getTracks().forEach(x => pc.addTrack(x, localUserMedia));
    pc.onicecandidate = (e) => {
      if(e.candidate && hub?.state === SignalR.HubConnectionState.Connected) {
        hub?.invoke("SendIceCandidate", connectionId, JSON.stringify(e.candidate))
      }
    }
    pc.ontrack = (e) => {
      const stream = e.streams[0];
      setRemoteStreams((prev) => ({
        ...prev,
        [connectionId]: stream
      }));
      const cam = stream.getVideoTracks().length > 0;
      const mic = stream.getAudioTracks().length > 0;
      setPeerMediaState(prev => ({
        ...prev,
        [connectionId]: {
          camera: cam,
          microphone: mic
        }
      }))
    }
    
    peers.current[connectionId] = pc;
    return pc;
  }

  useEffect(() => {
    const initMedia = async () => {
      try {
        if (!localUserMedia) {
          const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          setLocalUserMedia(media);
        }
      } catch (e) {
        console.error("Error accessing media devices.", e);
      }
    };
    initMedia();
  }, [])

  useEffect(() => {
    if(localVideoRef.current && camOn) {
      localVideoRef.current.srcObject = localUserMedia;
    }
  }, [localVideoRef.current, camOn])
  
  
  return (
    <div className='min-h-screen flex flex-col items-center p-4'>
      <div className='min-h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full flex-1'>
        <div className="relative w-100 h-72">
          {
            camOn ?
            <VideoBox muted={true} ref={localVideoRef} /> : 
            <div className="bg-slate-900 rounded-lg 
              overflow-hidden border border-slate-700 items-center justify-center flex w-100 h-72"
            >
             <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`https://placehold.co/100x100/2196F3/FFFFFF?text=${user?.username[0].toUpperCase()}`}
                  alt={`${user?.username[0]}`}
                />
                <AvatarFallback>{user?.username[0]}</AvatarFallback>
              </Avatar>
            </div>
          }
          <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            You
          </span>
        </div>
        {activePeers.map((connectionId: string) => (
          <div key={`id-${connectionId}`} className="relative w-100 h-72">
            {
              remoteStreams[connectionId] && peerMediaState[connectionId].camera ?
              <RemoteVideo stream={remoteStreams[connectionId]} /> :
              <div className="bg-slate-900 rounded-lg 
              overflow-hidden border border-slate-700 items-center justify-center flex
              w-100 h-72"
              >
                {peerData.current[connectionId] &&
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`https://placehold.co/100x100/2196F3/FFFFFF?text=${peerData.current[connectionId].username[0].toUpperCase()}`}
                    alt={`${peerData.current[connectionId].username[0]}`}
                  />
                  <AvatarFallback>{peerData.current[connectionId].username[0]}</AvatarFallback>
                </Avatar>}
              </div> 
            }
            {
              peerData.current[connectionId] && 
              <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {peerData.current[connectionId].username}
              </span>
            }
          </div>
        ))}
      </div>

      <div className='mt-4 flex gap-4 sticky bottom-4'>
        <Button variant={micOn ? 'default' : 'destructive'} onClick={() => micClickEvent()}>
          { micOn ? <Mic /> : <MicOff /> } 
        </Button>
        <Button variant={camOn ? 'default' : 'destructive'} onClick={() => camClickEvent()}>
          { camOn ? <Video /> : <VideoOff /> }
        </Button>
        {
          !isJoined ?
          <Button onClick={() => joinMeeting()}>
            Join meeting
          </Button> :
          <Button variant={'destructive'} onClick={() => leaveMeeting()}>
            <PhoneOff />
          </Button>
        }
      </div>
    </div>
  )
}

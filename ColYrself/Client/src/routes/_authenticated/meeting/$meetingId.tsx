import { createFileRoute } from '@tanstack/react-router'
import * as SignalR from "@microsoft/signalr"
import { useEffect, useRef, useState } from 'react';
import type { User } from '@/types/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import VideoBox from '@/components/video-box';
import RemoteVideo from '@/components/remote-video';

export const Route = createFileRoute('/_authenticated/meeting/$meetingId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { meetingId } = Route.useParams();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const hubConnection = useRef<SignalR.HubConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnection = useRef<Record<string, RTCPeerConnection>>({});
  const pcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302'}]
  }
  
  const [remoteStreams, setRemoteStreams] = useState<{connectionId: string, user: User, stream: MediaStream }[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  const closePeerConnection = (connectionId: string) => {
    setRemoteStreams(prev => {
      const remote = prev.find(x => x.connectionId === connectionId);
      remote?.stream.getTracks().forEach(t => t.stop());
      return prev.filter(x => x.connectionId !== connectionId);
    });

    peerConnection.current[connectionId]?.close();
    delete peerConnection.current[connectionId];
  };


  const getPeerConnection = async (user: User, connectionId: string) => {
    if(peerConnection.current[connectionId]) {
      return peerConnection.current[connectionId];
    }

    const pc = new RTCPeerConnection(pcConfig);
    
    localStreamRef.current?.getTracks().forEach(t => {
      pc.addTrack(t, localStreamRef.current!);
    })

    pc.onicecandidate = (e => {
      if(e.candidate && hubConnection.current) {
        hubConnection.current.invoke("SendIceCandidate", connectionId, JSON.stringify(e.candidate));
      }
    })

    pc.ontrack = (e => {
      console.log(e.streams[0].getTracks())
      const newStream = e.streams[0];
      setRemoteStreams(prev => {
        if(prev.some(x => x.connectionId === connectionId)) return prev;
        return [...prev, { connectionId, user, stream: newStream }];
      });
    })

    peerConnection.current[connectionId] = pc;

    console.log("Peer connection established with ", user.username)

    return pc;
  }

  useEffect(() => {
    if(!isJoined) return;
    hubConnection.current = new SignalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_SIGNALR_HUB)
      .withAutomaticReconnect()
      .build();
    
    const connection = hubConnection.current;
    if(!connection) return;

    connection.on("UserJoined", async (user: User, connectionId: string) => {
      toast.success(`${user.username} joined the meeting`);
      const pc = await getPeerConnection(user, connectionId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await connection.invoke("SendOffer", connectionId, JSON.stringify(offer));
    });

    connection.on("ReceiveOffer", async (user: User, offer: string, connectionId: string) => {
      console.log("Received offer from", user.username)
      const pc = await getPeerConnection(user, connectionId);
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await connection.invoke("SendAnswer", connectionId, JSON.stringify(answer))
    });

    connection.on("ReceiveAnswer", async (user: User, answer: string, connectionId: string) => {
      console.log("Received answer from ", user.username);
      const pc = peerConnection.current[connectionId];
      await pc?.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
    });

    connection.on("ReceiveIceCandidate", async (user: User, candidate: string, connectionId: string) => {
      console.log("Received ICE candidate from ", user.username);
      const pc = peerConnection.current[connectionId];
      await pc?.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    });

    connection.on("UserLeft", async (user: User, connectionId: string) => {
      toast.info(`${user.username} left the meeting`);
      closePeerConnection(connectionId);
    })

    connection.start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.error("SignalR Connection Error: ", err));
    
      return () => {
        connection.stop();
      };

  }, [isJoined]);

  async function startVideo() {
    try {
      setIsJoined(true);
      const stream = await navigator.mediaDevices.getUserMedia(({ video: true, audio: true }));
      localStreamRef.current = stream;
      if(localVideoRef.current) localVideoRef.current.srcObject = stream;
      await hubConnection.current?.invoke("JoinMeeting", meetingId);
    } catch(error) {
      toast.error("Error accessing camera or microphone.");
    }
  }

  async function leaveMeeting() {
    try {
      await hubConnection.current?.invoke("LeaveMeeting", meetingId);
      if(localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
        localStreamRef.current = null;
      };
      Object.keys(peerConnection.current).forEach(id => closePeerConnection(id));
      setIsJoined(false);
    } catch(error) {
      toast.error("Error leaving the meeting.");
    }
  }

  return (
    <div className='h-full flex flex-col items-center p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full flex-1 overflow-y-auto'>
        {
          isJoined && 
          <div className="relative">
            <VideoBox muted={true} ref={localVideoRef} />
            <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              You
            </span>
          </div>
        }
        {remoteStreams.map((remote) => (
          <div key={remote.connectionId} className="relative">
             <RemoteVideo stream={remote.stream} />
             <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {remote.user.username}
             </span>
          </div>
        ))}
      </div>

      <div className='mt-4 flex gap-4'>
        {isJoined ? (
          <Button variant="destructive" onClick={leaveMeeting}>Leave meeting</Button>
        ) : (
          <Button onClick={startVideo}>Join meeting</Button>
        )}
      </div>
    </div>
  )
}

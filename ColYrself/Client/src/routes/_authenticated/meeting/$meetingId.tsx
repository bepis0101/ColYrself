import { createFileRoute } from '@tanstack/react-router'
import * as SignalR from "@microsoft/signalr"
import { useEffect, useRef, useState } from 'react';
import type { User } from '@/types/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import VideoBox from '@/components/video-box';

export const Route = createFileRoute('/_authenticated/meeting/$meetingId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { meetingId } = Route.useParams();

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const hubConnection = useRef<SignalR.HubConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302'}]
  }

  const [isJoined, setIsJoined] = useState(false);

  function setupSignalRHandlers() {
    const connection = hubConnection.current;
    if(!connection) return;
    connection.on("UserJoined", async (user: User) => {
      await createOffer();
      toast.success(`${user.username} joined the meeting`);
    });

    connection.on("ReceiveOffer", async (userId: string, offer: string) => {
      console.log("Received offer from ", userId);
      await handleOffer(offer);
    });

    connection.on("ReceiveAnswer", async (userId: string, answer: string) => {
      console.log("Received answer from ", userId);
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
    });

    connection.on("ReceiveIceCandidate", async (userId: string, candidate: string) => {
      console.log("Received ICE candidate from ", userId);
      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
    });
  }

  async function createOffer() {
    if(!peerConnection.current || !hubConnection.current) return;
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    await hubConnection.current.invoke("SendOffer", meetingId, JSON.stringify(offer));
  }

  async function handleOffer(offer: string) {
    if(!peerConnection.current || !hubConnection.current) return;
    await peerConnection
      .current
      .setRemoteDescription(
        new RTCSessionDescription(
          JSON.parse(offer)
        )
      );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    await hubConnection.current.invoke("SendAnswer", meetingId, JSON.stringify(answer))
  }

  useEffect(() => {
    hubConnection.current = new SignalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_SIGNALR_HUB)
      .withAutomaticReconnect()
      .build();
    
    setupSignalRHandlers();

    hubConnection.current.start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => console.error("SignalR Connection Error: ", err));
    
      return () => {
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        peerConnection.current?.close();
        hubConnection.current?.stop();
      }

  }, []);

  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(({ video: true, audio: true }));
      localStreamRef.current = stream;
      if(localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      peerConnection.current = new RTCPeerConnection(pcConfig);
      stream.getTracks().forEach(t => {
        if(peerConnection.current && stream) {
          peerConnection.current.addTrack(t, stream);
        }
      });
      // TODO Handle more streams
      peerConnection.current.ontrack = (e: RTCTrackEvent) => {
        if(remoteVideoRef.current && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      }

      peerConnection.current.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
        if(e.candidate && hubConnection.current) {
          hubConnection.current.invoke("SendIceCandidate", meetingId, JSON.stringify(e.candidate));
        }
      }
      
      await hubConnection.current?.invoke("JoinMeeting", meetingId);
      setIsJoined(true);
    } catch(error) {
      toast.error("Error accessing media devices.");
    }
  }

  async function leaveMeeting() {
    try {
      await hubConnection.current?.invoke("LeaveMeeting", meetingId);
      if(localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }

      peerConnection.current?.close();

      setIsJoined(false);
      
      localVideoRef.current!.srcObject = null;
      remoteVideoRef.current!.srcObject = null;
    } catch(error) {
      toast.error("Error leaving the meeting.");
    }
  }

  return (
    <div className='h-full flex flex-col items-center'>
      <div className='flex flex-2 flex-row p-6 gap-4 w-full'>
        <VideoBox muted={true} videoRef={localVideoRef} />
        <VideoBox muted={false} videoRef={remoteVideoRef} />
      </div>
      <div className='flex flex-row items-center absolute bottom-4'>
        { isJoined && <Button variant="destructive" onClick={leaveMeeting}>Leave meeting</Button> }
        { !isJoined && <Button onClick={startVideo}>Join video</Button> }
      </div>
    </div>
  )
}

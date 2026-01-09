import { useEffect, useRef } from "react";
import VideoBox from "./video-box";

export default function RemoteVideo({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <VideoBox muted={false} ref={videoRef} />
  );
}

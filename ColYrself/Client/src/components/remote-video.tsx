import { useEffect, useRef } from "react";

export default function RemoteVideo({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const attachedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || attachedRef.current) return;

    video.srcObject = stream;
    attachedRef.current = true;

    video.onloadedmetadata = () => {
      video.play().catch(() => {});
    };
  }, [stream]);

  return (
    <div className="relative h-72 w-100 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}

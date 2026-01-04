export default function VideoBox({ muted, videoRef } : 
  { muted: boolean, videoRef: React.RefObject<HTMLVideoElement | null> }) {
  return (
    <div className="w-1/2 max-h-full">
      <video autoPlay playsInline muted={muted} ref={videoRef} />
    </div>
  )
}
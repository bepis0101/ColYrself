import { forwardRef } from "react";


const VideoBox = forwardRef<HTMLVideoElement, {muted: boolean}>((props, ref) => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={props.muted}
        className="w-full h-full object-cover"
      />
    </div>
  )
})

export default VideoBox;
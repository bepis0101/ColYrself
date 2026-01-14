import { forwardRef } from "react";


const VideoBox = forwardRef<HTMLVideoElement, {muted: boolean}>((props, ref) => {
  return (
    <div className="relative h-72 w-100 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
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
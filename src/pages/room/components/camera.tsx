import { useEffect, useRef, useState } from "react";

interface Props {
  stream: MediaStream;
  muted?: boolean;
  uuid: string;
}

const Camera = ({ stream, muted, uuid }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    if (muted) setIsMuted(muted);
  }, [stream, muted]);

  return (
    <div className="flex w-full h-full m-auto">
      <div className="w-full h-full relative flex">
        <video
          ref={ref}
          muted={isMuted}
          autoPlay
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          className="w-full h-full rounded-2xl object-contain"
        />
        <div className="absolute bottom-2 w-full px-4">
          <div className="w-full h-auto bg-white bg-opacity-40 rounded-full p-1 text-center">
            <span className="text-black font-bold">{uuid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;

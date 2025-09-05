import { CameraManager } from "@prismlabs/web-scan-core";
import React, { useCallback } from "react";

interface CameraFeedProps {
  cameraManager: CameraManager;
  onVideoReady?: (video: HTMLVideoElement) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
  cameraManager,
  onVideoReady,
}) => {
  const videoHandler = useCallback((video: HTMLVideoElement | null) => {
    if (video && onVideoReady) {
      onVideoReady(video);
    }
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          transform: "scaleX(-1)",
          WebkitTransform: "scaleX(-1)",
        }}
        ref={videoHandler}
        disablePictureInPicture={true}
        autoPlay
        playsInline
        muted
      ></video>
    </div>
  );
};

export default CameraFeed;

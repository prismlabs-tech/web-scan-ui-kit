import { CameraManager } from "@prismlabs/web-scan-core";
import React from "react";
interface CameraFeedProps {
    cameraManager: CameraManager;
    onVideoReady?: (video: HTMLVideoElement) => void;
}
declare const CameraFeed: React.FC<CameraFeedProps>;
export default CameraFeed;

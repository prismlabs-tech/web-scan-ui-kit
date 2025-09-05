import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from "react";
var CameraFeed = function (_a) {
    var cameraManager = _a.cameraManager, onVideoReady = _a.onVideoReady;
    var videoHandler = useCallback(function (video) {
        if (video && onVideoReady) {
            onVideoReady(video);
        }
    }, []);
    return (_jsx("div", { style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }, children: _jsx("video", { style: {
                objectFit: "cover",
                width: "100%",
                height: "100%",
                transform: "scaleX(-1)",
                WebkitTransform: "scaleX(-1)",
            }, ref: videoHandler, disablePictureInPicture: true, autoPlay: true, playsInline: true, muted: true }) }));
};
export default CameraFeed;

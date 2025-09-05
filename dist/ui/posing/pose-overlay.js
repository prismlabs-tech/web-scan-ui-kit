import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useRef } from "react";
import { getCssVarValue } from '../theme/theme-helpers.js';
export var PoseOverlay = function (_a) {
    var prismSession = _a.prismSession, posingState = _a.posingState, drawSkeleton = _a.drawSkeleton;
    var canvasRef = useRef(null);
    var subscriptionRef = useRef(null);
    var canvasHandler = useCallback(function (canvas) {
        if (canvas) {
            canvasRef.current = canvas;
            // Make sure canvas size matches the video dimensions
            var videoElement = prismSession.captureSession.cameraManager.videoElement;
            if (videoElement) {
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
            }
        }
    }, []);
    // Set up canvas and drawing context
    useEffect(function () {
        // Clear any existing subscriptions
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }
        var theme = {
            acceptableColor: getCssVarValue("--pose-acceptable-color"),
            unacceptableColor: getCssVarValue("--pose-unacceptable-color"),
            landmarkColor: getCssVarValue("--pose-landmark-color"),
            boneThickness: 30,
        };
        // Subscribe to frame updates from the frame distributor
        subscriptionRef.current =
            prismSession.captureSession.frameDistributor.windowedAverageFrame.subscribe(function (frame) {
                if (frame && canvasRef.current) {
                    var canvas = canvasRef.current;
                    drawSkeleton(frame, posingState === null || posingState === void 0 ? void 0 : posingState.detectionFeedback, canvas, theme);
                }
            });
        return function () {
            var _a;
            (_a = subscriptionRef.current) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        };
    }, [posingState]);
    return (_jsx("canvas", { ref: canvasHandler, style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            objectFit: "cover",
        } }));
};

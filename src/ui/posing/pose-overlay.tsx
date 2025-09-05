import {
  DetectionFeedback,
  Frame,
  PrismSession,
} from "@prismlabs/web-scan-core";
import React, { useCallback, useEffect, useRef } from "react";
import { Subscription } from "rxjs";
import { getCssVarValue } from "../theme/theme-helpers";
import { PosingState } from "./posing-state-distributor";
import { PoseTheme } from "./skelton-drawing-utils";

interface PoseOverlayProps {
  prismSession: PrismSession;
  posingState: PosingState | null;
  drawSkeleton: (
    frame: Frame,
    detectionFeedback: DetectionFeedback | undefined,
    canvas: HTMLCanvasElement,
    theme: PoseTheme
  ) => void;
}

export const PoseOverlay: React.FC<PoseOverlayProps> = ({
  prismSession,
  posingState,
  drawSkeleton,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  const canvasHandler = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      canvasRef.current = canvas;
      // Make sure canvas size matches the video dimensions
      const videoElement =
        prismSession.captureSession.cameraManager.videoElement;
      if (videoElement) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
      }
    }
  }, []);

  // Set up canvas and drawing context
  useEffect(() => {
    // Clear any existing subscriptions
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    const theme: PoseTheme = {
      acceptableColor: getCssVarValue("--pose-acceptable-color"),
      unacceptableColor: getCssVarValue("--pose-unacceptable-color"),
      landmarkColor: getCssVarValue("--pose-landmark-color"),
      boneThickness: 30,
    };

    // Subscribe to frame updates from the frame distributor
    subscriptionRef.current =
      prismSession.captureSession.frameDistributor.windowedAverageFrame.subscribe(
        (frame: Frame | undefined) => {
          if (frame && canvasRef.current) {
            const canvas = canvasRef.current;

            drawSkeleton(frame, posingState?.detectionFeedback, canvas, theme);
          }
        }
      );

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [posingState]);

  return (
    <canvas
      ref={canvasHandler}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        objectFit: "cover",
      }}
    />
  );
};

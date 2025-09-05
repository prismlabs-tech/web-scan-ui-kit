import { DetectionFeedback, Frame, PrismSession } from "@prismlabs/web-scan-core";
import React from "react";
import { PosingState } from "./posing-state-distributor";
import { PoseTheme } from "./skelton-drawing-utils";
interface PoseOverlayProps {
    prismSession: PrismSession;
    posingState: PosingState | null;
    drawSkeleton: (frame: Frame, detectionFeedback: DetectionFeedback | undefined, canvas: HTMLCanvasElement, theme: PoseTheme) => void;
}
export declare const PoseOverlay: React.FC<PoseOverlayProps>;
export {};

import { Bone, DetectionFailure, DetectionFeedback, Frame, Landmark } from "@prismlabs/web-scan-core";
export interface PoseTheme {
    acceptableColor: string;
    unacceptableColor: string;
    landmarkColor: string;
    boneThickness: number;
}
export interface ColoredBone {
    bone: Bone;
    color: string;
}
/**
 * Color bones based on detection feedback results
 */
export declare function colorBones(bones: Bone[] | null, detectionFeedback: DetectionFeedback | undefined, theme: PoseTheme): ColoredBone[];
/**
 * Color bone based on specific detection failure
 */
export declare function colorBoneByFailure(bone: Bone, failure: DetectionFailure | undefined, theme: PoseTheme): ColoredBone;
export declare function drawSkeleton(frame: Frame, detectionFeedback: DetectionFeedback | undefined, canvas: HTMLCanvasElement, theme: PoseTheme): void;
export declare function drawLandmarksWithColoredBones(ctx: CanvasRenderingContext2D, landmarks: Landmark[], detectionFeedback: DetectionFeedback | undefined, canvasWidth: number, canvasHeight: number, theme: PoseTheme): void;

import { DetectionFeedback } from "@prismlabs/web-scan-core";
import { TFunction } from "i18next/typescript/t";
export declare function getDetectionFeedbackLocalization(feedback: DetectionFeedback): string;
export declare function getDetectionFeedbackVoiceLocalization(feedback: DetectionFeedback, t: TFunction<"translation", undefined>): string;

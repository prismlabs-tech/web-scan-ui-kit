import { DetectionFailure, DetectionFeedbackType, } from "@prismlabs/web-scan-core";
import { useTranslation } from "react-i18next";
export function getDetectionFeedbackLocalization(feedback) {
    var t = useTranslation().t;
    switch (feedback.type) {
        case DetectionFeedbackType.Approved:
            return t("positioning.text.completeMessage");
        case DetectionFeedbackType.EmptyFrame:
            return t("detectionError.text.notInFrame");
        case DetectionFeedbackType.IncompleteData:
            return t("detectionError.text.incompleteData");
        case DetectionFeedbackType.MultiplePeople:
            return t("detectionError.text.multiplePoses");
        default:
            // We have a specific failure case
            break;
    }
    switch (feedback.detectionFailure) {
        case DetectionFailure.TOO_FAR:
            return t("detectionError.text.moveClose");
        case DetectionFailure.TOO_CLOSE:
            return t("detectionError.text.moveBack");
        case DetectionFailure.TOO_FAR_LEFT:
            return t("detectionError.text.moveRight");
        case DetectionFailure.TOO_FAR_RIGHT:
            return t("detectionError.text.moveLeft");
        case DetectionFailure.BACKWARD:
            return t("detectionError.text.faceForward");
        case DetectionFailure.CAMERA_TOO_HIGH:
            return t("detectionError.text.cameraTooHigh");
        case DetectionFailure.CAMERA_TOO_LOW:
            return t("detectionError.text.cameraTooLow");
        case DetectionFailure.EMPTY_SPACE_TOP:
            return t("detectionError.text.emptySpaceTop");
        case DetectionFailure.EMPTY_SPACE_BOTTOM:
            return t("detectionError.text.emptySpaceBottom");
        case DetectionFailure.NOT_UPRIGHT:
            return t("detectionError.text.notUpright");
        case DetectionFailure.BAD_LEG_POSE:
            return t("detectionError.text.badLegPose");
        case DetectionFailure.BAD_ARM_POSE:
            return t("detectionError.text.badArmPose");
        case DetectionFailure.RIGHT_ARM_RAISED:
            return t("detectionError.text.rightArmRaised");
        case DetectionFailure.LEFT_ARM_RAISED:
            return t("detectionError.text.leftArmRaised");
        case DetectionFailure.RIGHT_ARM_TOO_HIGH:
            return t("detectionError.text.rightArmTooHigh");
        case DetectionFailure.LEFT_ARM_TOO_HIGH:
            return t("detectionError.text.leftArmTooHigh");
        case DetectionFailure.RIGHT_ARM_TOO_LOW:
            return t("detectionError.text.rightArmTooLow");
        case DetectionFailure.LEFT_ARM_TOO_LOW:
            return t("detectionError.text.leftArmTooLow");
        case DetectionFailure.BAD_ARM_ALIGNMENT:
            return t("detectionError.text.badArmAlignment");
        case DetectionFailure.OCCLUDED_FEET:
            return t("detectionError.text.occludedFeet");
        default:
            return "";
    }
}
export function getDetectionFeedbackVoiceLocalization(feedback, t) {
    switch (feedback.type) {
        case DetectionFeedbackType.Approved:
            return t("positioning.voice.completeMessage");
        case DetectionFeedbackType.EmptyFrame:
            return t("detectionError.voice.notInFrame");
        case DetectionFeedbackType.IncompleteData:
            return t("detectionError.voice.incompleteData");
        case DetectionFeedbackType.MultiplePeople:
            return t("detectionError.voice.multiplePoses");
        default:
            // We have a specific failure case
            break;
    }
    switch (feedback.detectionFailure) {
        case DetectionFailure.TOO_FAR:
            return t("detectionError.voice.moveClose");
        case DetectionFailure.TOO_CLOSE:
            return t("detectionError.voice.moveBack");
        case DetectionFailure.TOO_FAR_LEFT:
            return t("detectionError.voice.moveRight");
        case DetectionFailure.TOO_FAR_RIGHT:
            return t("detectionError.voice.moveLeft");
        case DetectionFailure.BACKWARD:
            return t("detectionError.voice.faceForward");
        case DetectionFailure.CAMERA_TOO_HIGH:
            return t("detectionError.voice.cameraTooHigh");
        case DetectionFailure.CAMERA_TOO_LOW:
            return t("detectionError.voice.cameraTooLow");
        case DetectionFailure.EMPTY_SPACE_TOP:
            return t("detectionError.voice.emptySpaceTop");
        case DetectionFailure.EMPTY_SPACE_BOTTOM:
            return t("detectionError.voice.emptySpaceBottom");
        case DetectionFailure.NOT_UPRIGHT:
            return t("detectionError.voice.notUpright");
        case DetectionFailure.BAD_LEG_POSE:
            return t("detectionError.voice.badLegPose");
        case DetectionFailure.BAD_ARM_POSE:
            return t("detectionError.voice.badArmPose");
        case DetectionFailure.RIGHT_ARM_RAISED:
            return t("detectionError.voice.rightArmRaised");
        case DetectionFailure.LEFT_ARM_RAISED:
            return t("detectionError.voice.leftArmRaised");
        case DetectionFailure.RIGHT_ARM_TOO_HIGH:
            return t("detectionError.voice.rightArmTooHigh");
        case DetectionFailure.LEFT_ARM_TOO_HIGH:
            return t("detectionError.voice.leftArmTooHigh");
        case DetectionFailure.RIGHT_ARM_TOO_LOW:
            return t("detectionError.voice.rightArmTooLow");
        case DetectionFailure.LEFT_ARM_TOO_LOW:
            return t("detectionError.voice.leftArmTooLow");
        case DetectionFailure.BAD_ARM_ALIGNMENT:
            return t("detectionError.voice.badArmAlignment");
        case DetectionFailure.OCCLUDED_FEET:
            return t("detectionError.voice.occludedFeet");
        default:
            return "";
    }
}

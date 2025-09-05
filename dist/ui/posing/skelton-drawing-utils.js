import { BoneGroup, BoneIdentifier, DetectionFailure, DetectionFeedbackType, landmarksToBones, PoseLandmark, } from "@prismlabs/web-scan-core";
// Bone to skeleton connection mapping - maps each bone to its corresponding skeleton connection
var boneToConnectionMap = new Map([
    // Arm bones
    [
        BoneIdentifier.LeftUpperArm,
        [PoseLandmark.LEFT_SHOULDER, PoseLandmark.LEFT_ELBOW],
    ],
    [
        BoneIdentifier.RightUpperArm,
        [PoseLandmark.RIGHT_SHOULDER, PoseLandmark.RIGHT_ELBOW],
    ],
    [
        BoneIdentifier.LeftLowerArm,
        [PoseLandmark.LEFT_ELBOW, PoseLandmark.LEFT_WRIST],
    ],
    [
        BoneIdentifier.RightLowerArm,
        [PoseLandmark.RIGHT_ELBOW, PoseLandmark.RIGHT_WRIST],
    ],
    // Leg bones
    [
        BoneIdentifier.LeftUpperLeg,
        [PoseLandmark.LEFT_HIP, PoseLandmark.LEFT_KNEE],
    ],
    [
        BoneIdentifier.RightUpperLeg,
        [PoseLandmark.RIGHT_HIP, PoseLandmark.RIGHT_KNEE],
    ],
    [
        BoneIdentifier.LeftLowerLeg,
        [PoseLandmark.LEFT_KNEE, PoseLandmark.LEFT_ANKLE],
    ],
    [
        BoneIdentifier.RightLowerLeg,
        [PoseLandmark.RIGHT_KNEE, PoseLandmark.RIGHT_ANKLE],
    ],
    // Torso bones
    [
        BoneIdentifier.TorsoUpper,
        [PoseLandmark.LEFT_SHOULDER, PoseLandmark.RIGHT_SHOULDER],
    ],
    [BoneIdentifier.TorsoLower, [PoseLandmark.LEFT_HIP, PoseLandmark.RIGHT_HIP]],
    [
        BoneIdentifier.TorsoLeft,
        [PoseLandmark.LEFT_SHOULDER, PoseLandmark.LEFT_HIP],
    ],
    [
        BoneIdentifier.TorsoRight,
        [PoseLandmark.RIGHT_SHOULDER, PoseLandmark.RIGHT_HIP],
    ],
]);
var HIDDEN_LANDMARKS = new Set([
    PoseLandmark.NOSE,
    PoseLandmark.LEFT_EYE,
    PoseLandmark.LEFT_EAR,
    PoseLandmark.RIGHT_EYE,
    PoseLandmark.RIGHT_EAR,
]);
/**
 * Color bones based on detection feedback results
 */
export function colorBones(bones, detectionFeedback, theme) {
    if (!bones)
        return [];
    var coloredBones = [];
    if (!detectionFeedback) {
        for (var _i = 0, bones_1 = bones; _i < bones_1.length; _i++) {
            var bone = bones_1[_i];
            coloredBones.push({ bone: bone, color: theme.acceptableColor });
        }
        return coloredBones;
    }
    switch (detectionFeedback.type) {
        case DetectionFeedbackType.Approved:
            for (var _a = 0, bones_2 = bones; _a < bones_2.length; _a++) {
                var bone = bones_2[_a];
                coloredBones.push({ bone: bone, color: theme.acceptableColor });
            }
            break;
        case DetectionFeedbackType.EmptyFrame:
        case DetectionFeedbackType.IncompleteData:
            for (var _b = 0, bones_3 = bones; _b < bones_3.length; _b++) {
                var bone = bones_3[_b];
                coloredBones.push({ bone: bone, color: theme.unacceptableColor });
            }
            break;
        case DetectionFeedbackType.Failed:
            for (var _c = 0, bones_4 = bones; _c < bones_4.length; _c++) {
                var bone = bones_4[_c];
                coloredBones.push(colorBoneByFailure(bone, detectionFeedback.detectionFailure, theme));
            }
            break;
    }
    return coloredBones;
}
/**
 * Color bone based on specific detection failure
 */
export function colorBoneByFailure(bone, failure, theme) {
    if (!failure) {
        // If no failure, return acceptable color
        return { bone: bone, color: theme.acceptableColor };
    }
    switch (failure) {
        case DetectionFailure.TOO_FAR:
        case DetectionFailure.TOO_CLOSE:
        case DetectionFailure.TOO_FAR_LEFT:
        case DetectionFailure.TOO_FAR_RIGHT:
        case DetectionFailure.BACKWARD:
        case DetectionFailure.CAMERA_TOO_HIGH:
        case DetectionFailure.CAMERA_TOO_LOW:
        case DetectionFailure.EMPTY_SPACE_BOTTOM:
        case DetectionFailure.EMPTY_SPACE_TOP:
            return { bone: bone, color: theme.unacceptableColor };
        case DetectionFailure.NOT_UPRIGHT:
            if (bone.group === BoneGroup.Torso) {
                return { bone: bone, color: theme.unacceptableColor };
            }
            else {
                return { bone: bone, color: theme.acceptableColor };
            }
        case DetectionFailure.BAD_LEG_POSE:
        case DetectionFailure.OCCLUDED_FEET:
            if (bone.group === BoneGroup.LeftLeg ||
                bone.group === BoneGroup.RightLeg) {
                return { bone: bone, color: theme.unacceptableColor };
            }
            else {
                return { bone: bone, color: theme.acceptableColor };
            }
        case DetectionFailure.BAD_ARM_POSE:
        case DetectionFailure.BAD_ARM_ALIGNMENT:
            if (bone.group === BoneGroup.LeftArm ||
                bone.group === BoneGroup.RightArm) {
                return { bone: bone, color: theme.unacceptableColor };
            }
            else {
                return { bone: bone, color: theme.acceptableColor };
            }
        case DetectionFailure.RIGHT_ARM_RAISED:
        case DetectionFailure.RIGHT_ARM_TOO_HIGH:
        case DetectionFailure.RIGHT_ARM_TOO_LOW:
            if (bone.group === BoneGroup.RightArm) {
                return { bone: bone, color: theme.unacceptableColor };
            }
            else {
                return { bone: bone, color: theme.acceptableColor };
            }
        case DetectionFailure.LEFT_ARM_RAISED:
        case DetectionFailure.LEFT_ARM_TOO_HIGH:
        case DetectionFailure.LEFT_ARM_TOO_LOW:
            if (bone.group === BoneGroup.LeftArm) {
                return { bone: bone, color: theme.unacceptableColor };
            }
            else {
                return { bone: bone, color: theme.acceptableColor };
            }
        default:
            return { bone: bone, color: theme.acceptableColor };
    }
}
export function drawSkeleton(frame, detectionFeedback, canvas, theme) {
    var ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw landmarks with colored bones
    drawLandmarksWithColoredBones(ctx, frame.landmarks, detectionFeedback, canvas.width, canvas.height, theme);
}
// Function to draw landmarks with colored bones
export function drawLandmarksWithColoredBones(ctx, landmarks, detectionFeedback, canvasWidth, canvasHeight, theme) {
    if (landmarks.length === 0)
        return;
    // Get colored bones based on readiness state
    var bones = landmarksToBones(landmarks);
    var coloredBones = colorBones(bones, detectionFeedback, theme);
    // Create a map for faster landmark lookup
    var landmarkMap = new Map();
    landmarks.forEach(function (landmark) {
        landmarkMap.set(landmark.landmarkType, landmark);
    });
    // Draw connections first (skeleton) with colors
    ctx.lineWidth = theme.boneThickness;
    // Draw bones with their assigned colors
    coloredBones.forEach(function (coloredBone) {
        var boneConnection = boneToConnectionMap.get(coloredBone.bone.identifier);
        if (boneConnection) {
            var startLandmarkType = boneConnection[0], endLandmarkType = boneConnection[1];
            var startLandmark = landmarkMap.get(startLandmarkType);
            var endLandmark = landmarkMap.get(endLandmarkType);
            if (startLandmark && endLandmark) {
                var startX = (1 - startLandmark.percentagePosition.x) * canvasWidth;
                var startY = (1 - startLandmark.percentagePosition.y) * canvasHeight;
                var endX = (1 - endLandmark.percentagePosition.x) * canvasWidth;
                var endY = (1 - endLandmark.percentagePosition.y) * canvasHeight;
                ctx.strokeStyle = coloredBone.color;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
    });
    // Draw landmarks as points
    ctx.fillStyle = theme.landmarkColor;
    landmarks.forEach(function (landmark) {
        if (HIDDEN_LANDMARKS.has(landmark.landmarkType)) {
            return; // Skip hidden landmarks
        }
        var x = (1 - landmark.percentagePosition.x) * canvasWidth;
        var y = (1 - landmark.percentagePosition.y) * canvasHeight;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
    });
}

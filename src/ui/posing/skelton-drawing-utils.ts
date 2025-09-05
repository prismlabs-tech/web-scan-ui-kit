import {
  Bone,
  BoneGroup,
  BoneIdentifier,
  DetectionFailure,
  DetectionFeedback,
  DetectionFeedbackType,
  Frame,
  Landmark,
  landmarksToBones,
  PoseLandmark,
} from "@prismlabs/web-scan-core";

// Color theme for pose visualization
export interface PoseTheme {
  acceptableColor: string;
  unacceptableColor: string;
  landmarkColor: string;
  boneThickness: number;
}

// Bone to skeleton connection mapping - maps each bone to its corresponding skeleton connection
const boneToConnectionMap = new Map([
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

export interface ColoredBone {
  bone: Bone;
  color: string;
}

const HIDDEN_LANDMARKS = new Set<PoseLandmark>([
  PoseLandmark.NOSE,
  PoseLandmark.LEFT_EYE,
  PoseLandmark.LEFT_EAR,
  PoseLandmark.RIGHT_EYE,
  PoseLandmark.RIGHT_EAR,
]);

/**
 * Color bones based on detection feedback results
 */
export function colorBones(
  bones: Bone[] | null,
  detectionFeedback: DetectionFeedback | undefined,
  theme: PoseTheme
): ColoredBone[] {
  if (!bones) return [];
  const coloredBones: ColoredBone[] = [];

  if (!detectionFeedback) {
    for (const bone of bones) {
      coloredBones.push({ bone, color: theme.acceptableColor });
    }
    return coloredBones;
  }

  switch (detectionFeedback.type) {
    case DetectionFeedbackType.Approved:
      for (const bone of bones) {
        coloredBones.push({ bone, color: theme.acceptableColor });
      }
      break;
    case DetectionFeedbackType.EmptyFrame:
    case DetectionFeedbackType.IncompleteData:
      for (const bone of bones) {
        coloredBones.push({ bone, color: theme.unacceptableColor });
      }
      break;
    case DetectionFeedbackType.Failed:
      for (const bone of bones) {
        coloredBones.push(
          colorBoneByFailure(bone, detectionFeedback.detectionFailure, theme)
        );
      }
      break;
  }

  return coloredBones;
}

/**
 * Color bone based on specific detection failure
 */
export function colorBoneByFailure(
  bone: Bone,
  failure: DetectionFailure | undefined,
  theme: PoseTheme
): ColoredBone {
  if (!failure) {
    // If no failure, return acceptable color
    return { bone, color: theme.acceptableColor };
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
      return { bone, color: theme.unacceptableColor };

    case DetectionFailure.NOT_UPRIGHT:
      if (bone.group === BoneGroup.Torso) {
        return { bone, color: theme.unacceptableColor };
      } else {
        return { bone, color: theme.acceptableColor };
      }

    case DetectionFailure.BAD_LEG_POSE:
    case DetectionFailure.OCCLUDED_FEET:
      if (
        bone.group === BoneGroup.LeftLeg ||
        bone.group === BoneGroup.RightLeg
      ) {
        return { bone, color: theme.unacceptableColor };
      } else {
        return { bone, color: theme.acceptableColor };
      }

    case DetectionFailure.BAD_ARM_POSE:
    case DetectionFailure.BAD_ARM_ALIGNMENT:
      if (
        bone.group === BoneGroup.LeftArm ||
        bone.group === BoneGroup.RightArm
      ) {
        return { bone, color: theme.unacceptableColor };
      } else {
        return { bone, color: theme.acceptableColor };
      }

    case DetectionFailure.RIGHT_ARM_RAISED:
    case DetectionFailure.RIGHT_ARM_TOO_HIGH:
    case DetectionFailure.RIGHT_ARM_TOO_LOW:
      if (bone.group === BoneGroup.RightArm) {
        return { bone, color: theme.unacceptableColor };
      } else {
        return { bone, color: theme.acceptableColor };
      }

    case DetectionFailure.LEFT_ARM_RAISED:
    case DetectionFailure.LEFT_ARM_TOO_HIGH:
    case DetectionFailure.LEFT_ARM_TOO_LOW:
      if (bone.group === BoneGroup.LeftArm) {
        return { bone, color: theme.unacceptableColor };
      } else {
        return { bone, color: theme.acceptableColor };
      }

    default:
      return { bone, color: theme.acceptableColor };
  }
}

export function drawSkeleton(
  frame: Frame,
  detectionFeedback: DetectionFeedback | undefined,
  canvas: HTMLCanvasElement,
  theme: PoseTheme
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw landmarks with colored bones
  drawLandmarksWithColoredBones(
    ctx,
    frame.landmarks,
    detectionFeedback,
    canvas.width,
    canvas.height,
    theme
  );
}

// Function to draw landmarks with colored bones
export function drawLandmarksWithColoredBones(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  detectionFeedback: DetectionFeedback | undefined,
  canvasWidth: number,
  canvasHeight: number,
  theme: PoseTheme
) {
  if (landmarks.length === 0) return;

  // Get colored bones based on readiness state
  const bones = landmarksToBones(landmarks);
  const coloredBones = colorBones(bones, detectionFeedback, theme);

  // Create a map for faster landmark lookup
  const landmarkMap = new Map<PoseLandmark, Landmark>();
  landmarks.forEach((landmark) => {
    landmarkMap.set(landmark.landmarkType, landmark);
  });

  // Draw connections first (skeleton) with colors
  ctx.lineWidth = theme.boneThickness;

  // Draw bones with their assigned colors
  coloredBones.forEach((coloredBone) => {
    const boneConnection = boneToConnectionMap.get(coloredBone.bone.identifier);
    if (boneConnection) {
      const [startLandmarkType, endLandmarkType] = boneConnection;
      const startLandmark = landmarkMap.get(startLandmarkType);
      const endLandmark = landmarkMap.get(endLandmarkType);

      if (startLandmark && endLandmark) {
        const startX = (1 - startLandmark.percentagePosition.x) * canvasWidth;
        const startY = (1 - startLandmark.percentagePosition.y) * canvasHeight;
        const endX = (1 - endLandmark.percentagePosition.x) * canvasWidth;
        const endY = (1 - endLandmark.percentagePosition.y) * canvasHeight;

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
  landmarks.forEach((landmark) => {
    if (HIDDEN_LANDMARKS.has(landmark.landmarkType)) {
      return; // Skip hidden landmarks
    }

    const x = (1 - landmark.percentagePosition.x) * canvasWidth;
    const y = (1 - landmark.percentagePosition.y) * canvasHeight;

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
  });
}

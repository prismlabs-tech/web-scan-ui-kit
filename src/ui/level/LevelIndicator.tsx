import {
  Level,
  LevelReadiness,
  MotionDistributor,
  OrientationData,
  validateLevelReadiness,
} from "@prismlabs/web-scan-core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AnimatedProgressCheckmarkView from "../components/AnimatedProgressCheckmarkView";
import { LevelBar } from "./LevelBar";
import { LevelLine } from "./LevelLine";

const Container = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const BarWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const CenteredLevelLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  z-index: 2;
  pointer-events: none;
`;

const LEVEL_BAR_HEIGHT = 54; // pixels - height of the LevelBar component
const MAX_ACCEPTABLE_TILT = 3; // degrees - maximum tilt (either way) before we consider it not level
const MAX_ROTATION = 100; // pixels - maximum rotation in either direction for the level bar
const SCALE_FACTOR = LEVEL_BAR_HEIGHT / (MAX_ACCEPTABLE_TILT * 2); // Scale factor based on size of the level bar divided into degrees (tilt can be positive or negative)

interface LevelIndicatorProps {
  motionDistributor: MotionDistributor;
  onLevelChange?: (level: Level) => void; // Callback function to return Level enum value
  onReady?: () => void; // Optional callback when the level is ready
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  motionDistributor,
  onLevelChange,
  onReady,
}) => {
  const [levelReadiness, setLevelReadiness] = useState<LevelReadiness | null>(
    null
  );
  const [rotationPixels, setRotationPixels] = useState(0);

  // Clamp pixel value
  const clampRotation = (value: number): number => {
    return Math.max(Math.min(value, MAX_ROTATION), -MAX_ROTATION);
  };

  // Scale the value based on the level bar height
  const scaleRotationToPixels = (value: number): number => {
    return value * SCALE_FACTOR;
  };

  // Start listening for orientation changes
  const startMotionTracking = () => {
    // Add our listener
    return motionDistributor.windowedAverageOrientationData.subscribe(
      (data: OrientationData | null) => {
        if (!data) {
          return;
        }

        // Validate the level using our new validator
        const readiness = validateLevelReadiness(data);
        setLevelReadiness(readiness);

        const valueInPixels = scaleRotationToPixels(readiness.verticalRotation);
        const adjustedRotation =
          readiness.level === Level.LEVEL ? 0 : clampRotation(valueInPixels); // snap to 0 if level

        setRotationPixels(adjustedRotation);
      }
    );
  };

  useEffect(() => {
    const subscription = startMotionTracking();

    // Cleanup when component unmounts
    return () => {
      subscription.unsubscribe();
      motionDistributor.stopListening();
    };
  }, []);

  useEffect(() => {
    if (levelReadiness?.level && onLevelChange) {
      onLevelChange(levelReadiness?.level); // Trigger callback
    }
  }, [levelReadiness, onLevelChange]);

  const handleAnimationFinished = () => {
    if (onReady) {
      onReady();
    }
  };

  if (!levelReadiness) {
    return <div></div>;
  }

  return (
    <Container>
      <BarWrapper>
        <LevelBar state={levelReadiness.level} rotationPx={rotationPixels} />
        {levelReadiness.level === Level.LEVEL && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
          >
            <AnimatedProgressCheckmarkView
              onAnimationComplete={handleAnimationFinished}
              duration={1500}
            />
          </div>
        )}
        <CenteredLevelLine>
          <LevelLine />
        </CenteredLevelLine>
      </BarWrapper>
    </Container>
  );
};

export default LevelIndicator;

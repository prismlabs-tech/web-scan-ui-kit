import { Level, MotionDistributor } from "@prismlabs/web-scan-core";
import React from "react";
interface LevelIndicatorProps {
    motionDistributor: MotionDistributor;
    onLevelChange?: (level: Level) => void;
    onReady?: () => void;
}
declare const LevelIndicator: React.FC<LevelIndicatorProps>;
export default LevelIndicator;

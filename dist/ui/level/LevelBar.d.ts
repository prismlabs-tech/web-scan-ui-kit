import { Level } from '@prismlabs/web-scan-core';
import React from 'react';
interface LevelBarProps {
    state: Level;
    rotationPx?: number;
}
export declare const LevelBar: React.FC<LevelBarProps>;
export default LevelBar;

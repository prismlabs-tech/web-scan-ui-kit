import React from 'react';
export interface PieProgressProps {
    /** Size in px of the full control (outer diameter, including ring). */
    size?: number;
    /** Ring (stroke) thickness in px. */
    ringWidth?: number;
    /** Remaining progress, 0..1 where 1 = 100% remaining. */
    progress: number;
    /** Fill color inside the pie. */
    fillColor?: string;
    /** Ring and empty wedge color. */
    trackColor?: string;
    /** Starting angle in degrees (CSS conic-gradient). */
    startAngleDeg?: number;
    className?: string;
}
declare const PieProgress: React.FC<PieProgressProps>;
export default PieProgress;

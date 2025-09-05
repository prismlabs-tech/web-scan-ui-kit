import React from 'react';
interface CameraViewfinderProps {
    /** Size of the square area containing the corner brackets (default 125 like native spec) */
    size?: number;
    /** Diameter of central circle (default 75) */
    centerDiameter?: number;
    /** Length of each corner bracket arm (default 35) */
    cornerLength?: number;
    /** Stroke/line thickness (default 8) */
    strokeWidth?: number;
    /** Color (defaults to --prism-viewfinder-color or rgba(255,255,255,0.8)) */
    color?: string;
    className?: string;
}
declare const CameraViewfinder: React.FC<CameraViewfinderProps>;
export default CameraViewfinder;

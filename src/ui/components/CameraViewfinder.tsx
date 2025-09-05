import React, { useMemo } from 'react'
import styled from 'styled-components'

// Primary overlay container spans the full parent so lines can reach edges
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.8;
`

const Line = styled.div<{
  $orientation: 'horizontal' | 'vertical'
  $thickness: number
  $color: string
}>`
  position: absolute;
  background: ${(p) => p.$color};
  ${(p) =>
    p.$orientation === 'horizontal'
      ? `top: 50%; left: 0; transform: translateY(-50%); height: ${p.$thickness}px; width: 100%;`
      : `left: 50%; top: 0; transform: translateX(-50%); width: ${p.$thickness}px; height: 100%;`}
`

const CenterCircle = styled.div<{ $diameter: number; $color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${(p) => p.$diameter}px;
  height: ${(p) => p.$diameter}px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: ${(p) => p.$color};
`

const CornerSvg = styled.svg<{ $size: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  transform: translate(-50%, -50%);
  overflow: visible;
`

const CornerPath = styled.path<{ $strokeWidth: number; $color: string }>`
  stroke: ${(p) => p.$color};
  stroke-width: ${(p) => p.$strokeWidth}px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`

interface CameraViewfinderProps {
  /** Size of the square area containing the corner brackets (default 125 like native spec) */
  size?: number
  /** Diameter of central circle (default 75) */
  centerDiameter?: number
  /** Length of each corner bracket arm (default 35) */
  cornerLength?: number
  /** Stroke/line thickness (default 8) */
  strokeWidth?: number
  /** Color (defaults to --prism-viewfinder-color or rgba(255,255,255,0.8)) */
  color?: string
  className?: string
}

const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  size = 125,
  centerDiameter = 75,
  cornerLength = 35,
  strokeWidth = 8,
  color = 'var(--prism-viewfinder-color, rgba(255,255,255,0.8))',
  className,
}) => {
  const pathD = useMemo(() => {
    const s = size
    const L = cornerLength
    // Replicates SwiftUI path commands
    return [
      // Top-left
      `M0 0 L0 ${L}`,
      `M0 0 L${L} 0`,
      // Top-right
      `M${s} 0 L${s} ${L}`,
      `M${s - L} 0 L${s} 0`,
      // Bottom-left
      `M0 ${s} L0 ${s - L}`,
      `M0 ${s} L${L} ${s}`,
      // Bottom-right
      `M${s} ${s} L${s} ${s - L}`,
      `M${s - L} ${s} L${s} ${s}`,
    ].join(' ')
  }, [size, cornerLength])

  return (
    <Overlay className={className}>
      {/* Full-screen crosshair lines */}
      <Line $orientation="horizontal" $thickness={strokeWidth} $color={color} />
      <Line $orientation="vertical" $thickness={strokeWidth} $color={color} />

      {/* Center circle */}
      <CenterCircle $diameter={centerDiameter} $color={color} />

      {/* Corner brackets */}
      <CornerSvg $size={size} viewBox={`0 0 ${size} ${size}`}>
        <CornerPath $strokeWidth={strokeWidth} $color={color} d={pathD} />
      </CornerSvg>
    </Overlay>
  )
}

export default CameraViewfinder

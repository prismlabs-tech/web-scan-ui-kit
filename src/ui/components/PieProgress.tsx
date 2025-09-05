import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'size',
})<{
  size: number
}>`
  position: relative;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  display: inline-block;
`

const Pie = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !['ring', 'fill', 'track', 'progress', 'startAngle'].includes(prop as string),
})<{
  ring: number
  fill: string
  track: string
  progress: number // 0..1 (1 = full, 0 = empty)
  startAngle: number
}>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: ${(p) => p.ring}px solid ${(p) => p.track};
  background: ${(p) =>
    `conic-gradient(from ${p.startAngle}deg, ${p.track} ${
      (1 - Math.max(0, Math.min(1, p.progress))) * 360
    }deg, ${p.fill} 0deg)`};
`

export interface PieProgressProps {
  /** Size in px of the full control (outer diameter, including ring). */
  size?: number
  /** Ring (stroke) thickness in px. */
  ringWidth?: number
  /** Remaining progress, 0..1 where 1 = 100% remaining. */
  progress: number
  /** Fill color inside the pie. */
  fillColor?: string
  /** Ring and empty wedge color. */
  trackColor?: string
  /** Starting angle in degrees (CSS conic-gradient). */
  startAngleDeg?: number
  className?: string
}

const PieProgress: React.FC<PieProgressProps> = ({
  size = 180,
  ringWidth = 10,
  progress,
  fillColor = 'var(--primary-color)',
  trackColor = 'var(--background-color)',
  startAngleDeg = 0,
  className,
}) => {
  return (
    <Wrapper size={size} className={className}>
      <Pie
        ring={ringWidth}
        fill={fillColor}
        track={trackColor}
        progress={progress}
        startAngle={startAngleDeg}
      />
    </Wrapper>
  )
}

export default PieProgress

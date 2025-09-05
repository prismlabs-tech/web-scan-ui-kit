import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Circle = styled.div`
  position: absolute;
  top: 5%;
  left: 5%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--success-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`

const PieShape = styled.div.attrs<{ $progress: number }>(({ $progress }) => ({
  style: {
    background: `conic-gradient(white ${$progress * 360}deg, transparent ${$progress * 360}deg)`,
  },
}))`
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  z-index: 0; /* Place pie chart at the back */
`

const Checkmark = styled.svg`
  width: 55px;
  height: 55px;
  stroke: white;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40; /* Total length of the path */
  stroke-dashoffset: 40; /* Initially hide the stroke */
  animation: draw 0.5s ease-out forwards 0.5s; /* Start immediately after the component mounts */

  @keyframes draw {
    to {
      stroke-dashoffset: 0; /* Fully reveal the stroke */
    }
  }
`

interface AnimatedProgressCheckmarkViewProps {
  duration?: number // animation duration in milliseconds
  onAnimationComplete?: () => void
}

const AnimatedProgressCheckmarkView: React.FC<AnimatedProgressCheckmarkViewProps> = ({
  duration = 2 * 1000,
  onAnimationComplete,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = 50 // Update every 50ms
    const increment = (100 / duration) * interval

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(timer)
          onAnimationComplete && onAnimationComplete()
          return 100
        }
        return newProgress
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position: 'relative', width: '95px', height: '95px' }}>
      <PieShape $progress={progress / 100} />
      <Circle style={{ transform: `scale(1.0)` }}>
        <Checkmark viewBox="0 0 24 24">
          <path d="M5 12l5 5L19 7" />
        </Checkmark>
      </Circle>
    </div>
  )
}

export default AnimatedProgressCheckmarkView

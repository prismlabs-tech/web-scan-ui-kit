import { Level } from '@prismlabs/web-scan-core'
import React from 'react'
import styled from 'styled-components'

interface LevelBarProps {
  state: Level
  rotationPx?: number
}

const Container = styled.div.attrs<{ $height: number; $translateY: number }>(
  ({ $height, $translateY }) => ({
    style: {
      height: `${$height}px`,
      transform: `translateY(${$translateY - $height / 2}px)`,
    },
  }),
)`
  position: relative;
  top: 200px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);
`

const Background = styled.div<{ $isLevel: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.$isLevel ? 'var(--success-color)' : 'var(--error-color)')};
  border-radius: 8px;
  box-sizing: border-box;
  z-index: 1;
  transition:
    background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    border 0.25s cubic-bezier(0.4, 0, 0.2, 1);
`

const CenteredLabel = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  color: #fff;
  font-weight: var(--body-font-weight);
  font-size: var(--body-font-size);
  font-family: var(--font-family);
  line-height: var(--body-line-height);
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  pointer-events: none;
`

export const LevelBar: React.FC<LevelBarProps> = ({ state, rotationPx = 0 }) => {
  const label = state === Level.LEVEL ? '' : 'NOT LEVEL'

  return (
    <Container $height={54} $translateY={rotationPx}>
      <Background $isLevel={state === Level.LEVEL} />
      <CenteredLabel>{label}</CenteredLabel>
    </Container>
  )
}

export default LevelBar

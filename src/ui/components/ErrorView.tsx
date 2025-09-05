import React from 'react'
import styled from 'styled-components'

const Circle = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--error-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`
const Cross = styled.svg`
  width: 55px;
  height: 55px;
  stroke: white;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;

  line {
    stroke-dasharray: 30;
    stroke-dashoffset: 30;
    animation: draw 0.4s ease-out forwards;
  }

  line:last-child {
    animation-delay: 0.15s; /* Stagger second stroke */
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }
`

const ErrorView: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '65px', height: '65px' }}>
      <Circle>
        <Cross viewBox="0 0 24 24">
          <line x1="7" y1="7" x2="17" y2="17" />
          <line x1="17" y1="7" x2="7" y2="17" />
        </Cross>
      </Circle>
    </div>
  )
}

export default ErrorView

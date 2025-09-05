import { styled } from 'styled-components'

const DarkbackgroundBlur = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  backdrop-filter: blur(16px);
  background: var(--overlay-color);
  pointer-events: none;
`
export default DarkbackgroundBlur

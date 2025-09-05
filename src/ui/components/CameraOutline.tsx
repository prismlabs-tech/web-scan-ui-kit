import { styled } from 'styled-components'

export enum OutlineState {
  Clear = 'clear',
  Error = 'error',
  Success = 'success',
}

const CameraOutline = styled.div<{ $outlineState: OutlineState }>`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border: 20px solid
    ${({ $outlineState }) => {
      switch ($outlineState) {
        case OutlineState.Clear:
          return 'var(--overlay-color)'
        case OutlineState.Error:
          return 'var(--error-color)'
        case OutlineState.Success:
          return 'var(--success-color)'
        default:
          return 'transparent'
      }
    }};
  pointer-events: none;
  z-index: 100;
  border-radius: 8px;
  box-shadow: ${({ $outlineState }) => {
    switch ($outlineState) {
      case OutlineState.Clear:
        return 'none'
      case OutlineState.Error:
        return 'inset 0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 20px var(--error-color)'
      case OutlineState.Success:
        return 'inset 0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 20px var(--success-color)'
      default:
        return 'none'
    }
  }};
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
`

export default CameraOutline

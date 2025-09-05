import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`

const Square = styled.div`
  width: 10px;
  height: 10px;
  background-color: black;
  transform: rotate(45deg);
`

const DashedLine = styled.div`
  flex: 1;
  height: 3px;
  margin: 0 16px;
  margin-top: 4px;
  border-top: 2px dashed black;
`

export const LevelLine: React.FC = () => {
  return (
    <Container>
      <Square />
      <DashedLine />
      <Square />
    </Container>
  )
}

export default LevelLine

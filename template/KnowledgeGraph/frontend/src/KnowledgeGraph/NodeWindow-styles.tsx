import styled from 'styled-components'

interface WindowContainerProps {
  readonly x: number;
  readonly y: number;
  readonly isVisible: boolean;
};

export const WindowContainer = styled.div<WindowContainerProps>`
  width: 300px;
  height: 250px;

  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;

  overflow: auto;

  position: absolute;
  left: ${props => props.x + "px"};
  top: ${props => props.y + "px"};

  display: ${props => props.isVisible ? "block" : "none"};

  background-color: red;
`

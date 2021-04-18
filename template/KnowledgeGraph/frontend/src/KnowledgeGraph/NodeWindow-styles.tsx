import styled from 'styled-components'

interface WindowContainerProps {
  readonly x: number;
  readonly y: number;
  readonly isVisible: boolean;
};

export const WindowContainer = styled.div<WindowContainerProps>`
  width: 300px;
  height: 400px;

  font-size: 0.8em;

  padding: 5px;
  border: 1px solid gray;
  border-radius: 5px;

  overflow: auto;

  position: absolute;
  left: ${props => props.x + "px"};
  top: ${props => props.y + "px"};

  display: ${props => props.isVisible ? "block" : "none"};

  background-color: rgb(240, 242, 246);
`

export const StyledSpinner = styled.svg`
  animation: rotate 1s linear infinite;
  width: 20px;
  height: 20px;

  & .path {
    stroke: #5652bf;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`

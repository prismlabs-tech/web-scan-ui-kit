import React from "react";
import styled from "styled-components";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: var(--button-text-color);
  font-family: var(--font-family);
  font-size: var(--body-font-size);
  font-weight: bold;
  border: none;
  border-radius: var(--primary-button-corner-radius);
  cursor: pointer;
  box-shadow: 0px 4px 8px var(--shadow-color);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  width: 100%; /* Fluid width to match the alert */
  height: 50px; /* Allow height to adjust based on content */

  &:active {
    transform: scale(0.95); /* Scale down on click */
    box-shadow: 0px 4px 8px var(--shadow-color);
  }
`;

const ActionButton: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default ActionButton;

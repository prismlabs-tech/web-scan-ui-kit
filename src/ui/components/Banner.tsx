import React from "react";
import styled from "styled-components";
import ActionButton from "./ActionButton";

export enum BannerType {
  TOP = "top",
  CENTER = "center",
}

interface BannerProps {
  title: string;
  centerComponent?: React.ReactNode;
  bottomTitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  type?: BannerType;
  style?: React.CSSProperties;
  className?: string;
}

const BannerContainer = styled.div<{ $type?: BannerType }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ $type }) =>
    $type === BannerType.TOP ? "flex-start" : "center"};
  border-radius: 20px;
  padding: 32px 32px 24px 32px;
  background: var(--background-color);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  font-family: inherit;
  margin: 8px 0;
  overflow: hidden;
  box-shadow: 0px 0px 32px var(--shadow-color);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px; /* Match the container's border radius */
    padding: 3px; /* Match the border width */
    background: var(--outline-gradient);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
  }
`;

const BannerTitle = styled.div`
  color: var(--text-color);
  font-family: var(--font-family);
  font-size: var(--large-title-font-size);
  font-weight: var(--large-title-font-weight);
  line-height: var(--large-title-line-height);
  text-align: center;
  color: #222;
  margin-bottom: 12px;
`;

const BannerBottomTitle = styled(BannerTitle)`
  color: var(--button-text-color);
  font-family: var(--font-family);
  font-size: var(--secondary-title-font-size);
  font-weight: var(--secondary-title-font-weight);
  line-height: var(--secondary-title-line-height);
  margin-bottom: 0;
  margin-top: 24px;
`;

export const AlertContainer = styled.div`
  position: absolute;
  z-index: 3; /* Topmost layer */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust for element's own size */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-radius: 8px; /* Optional: Add rounded corners */
`;

export const TopBannerContainer = styled.div`
  position: absolute;
  z-index: 3; /* Topmost layer */
  top: 20%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust for element's own size */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-radius: 8px; /* Optional: Add rounded corners */
`;

export const BottomBannerContainer = styled.div`
  position: absolute;
  z-index: 3; /* Topmost layer */
  bottom: 5%; /* Align near the bottom */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, 0); /* Only center horizontally */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-radius: 8px; /* Optional: Add rounded corners */
`;

const Banner: React.FC<BannerProps> = ({
  title,
  centerComponent,
  bottomTitle,
  buttonText,
  onButtonClick,
  type,
  style,
  className,
}) => (
  <BannerContainer style={style} className={className} $type={type}>
    <BannerTitle>{title}</BannerTitle>
    {centerComponent && (
      <div style={{ margin: "16px 0" }}>{centerComponent}</div>
    )}
    {bottomTitle && <BannerBottomTitle>{bottomTitle}</BannerBottomTitle>}
    {buttonText && (
      <div style={{ marginTop: "24px", width: "100%" }}>
        <ActionButton onClick={onButtonClick}>{buttonText}</ActionButton>
      </div>
    )}
  </BannerContainer>
);

export default Banner;

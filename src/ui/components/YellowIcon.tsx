import styled from "styled-components";
import { resolveSvg } from "../../assets/assetRegistry";

export enum YellowIconType {
  Alert = "alert",
  ArrowDown = "arrow_down",
  ArrowLeft = "arrow_left",
  ArrowRight = "arrow_right",
  ArrowUp = "arrow_up",
  BodyOverlay = "body_overlay",
  BodyScan = "body_scan",
  Book = "book",
  Check = "check",
  ChevronDown = "chevron_down",
  ChevronLeft = "chevron_left",
  ChevronRight = "chevron_right",
  ChevronUp = "chevron_up",
  Close = "close",
  Help = "help",
  Info = "info",
  Loading = "loading",
  Minus = "minus",
  MoveCameraDown = "move_camera_down",
  MoveCameraUp = "move_camera_up",
  Phone = "phone",
  Play = "play",
  Plus = "plus",
  Rotate = "rotate",
  Ruler = "ruler",
  Spin = "spin",
  User = "user",
  VolumeHigh = "volume_high",
  VolumeLow = "volume_low",
  VolumeMedium = "volume_medium",
  VolumeMute = "volume_mute",
}

const IconWrapper = styled.div`
  width: 82px;
  height: 82px;
  background-color: var(--icon-background-color); /* Yellow background */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconGraphic = styled.div<{ $src: string }>`
  width: 40px;
  height: 40px;
  /* Apply desired icon color here */
  background-color: var(--primary-icon-color);
  /* Use the SVG as a mask so we can color it via background-color */
  -webkit-mask: url(${(p) => p.$src}) no-repeat center / contain;
  mask: url(${(p) => p.$src}) no-repeat center / contain;
`;

interface YellowIconProps {
  icon: YellowIconType;
}

export const YellowIcon: React.FC<YellowIconProps> = ({ icon }) => {
  return (
    <IconWrapper>
      <IconGraphic $src={resolveSvg(icon)} aria-label={icon} role="img" />
    </IconWrapper>
  );
};

import Banner, {
  AlertContainer,
  BannerType,
  TopBannerContainer,
} from "@components/Banner";
import {
  Level,
  PrismSession,
  PrismSessionState,
} from "@prismlabs/web-scan-core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { resolveSvg } from "../../assets/assetRegistry";
import { YellowIcon, YellowIconType } from "../components";
import DarkbackgroundBlur from "../components/DarkBackgroundBlur";
import ScreenContainer from "../components/ScreenContainer";
import LevelIndicator from "./LevelIndicator";

const LevelIndicatorContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1; /* Above the blurred background */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

interface LevelScreenProps {
  prismSession: PrismSession;
}

const LevelScreen: React.FC<LevelScreenProps> = ({ prismSession }) => {
  const { t } = useTranslation();

  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [levelValue, setLevelValue] = useState<Level | null>(null);

  const handleDismissBanner = () => {
    // start listening now, since it needs to be in response to a user interaction
    prismSession.captureSession.levelReadinessDistributor.startListening();
    setIsBannerVisible(false);
  };

  const handleLevelChange = (level: Level) => {
    setLevelValue(level);
  };

  const handleLevelReady = () => {
    prismSession.continueFrom(PrismSessionState.LEVELING);
    prismSession.captureSession.levelReadinessDistributor.stopListening();
  };

  const getLevelTitle = (level: Level | null): string => {
    switch (level) {
      case Level.LEVEL:
        return t("leveling.level.level");
      case Level.BACKWARDS:
        return t("leveling.level.backwards");
      case Level.FORWARDS:
        return t("leveling.level.forwards");
      default:
        return t("leveling.level.unknownLevel");
    }
  };

  const getLevelIcon = (level: Level | null): React.ReactNode | undefined => {
    switch (level) {
      case Level.BACKWARDS:
        return <YellowIcon icon={YellowIconType.ArrowDown} />;
      case Level.FORWARDS:
        return <YellowIcon icon={YellowIconType.ArrowUp} />; // Replace with actual icon component
      default:
        return undefined; // Replace with actual icon component
    }
  };

  return (
    <ScreenContainer>
      <DarkbackgroundBlur />
      <LevelIndicatorContainer>
        <LevelIndicator
          motionDistributor={
            prismSession.captureSession.levelReadinessDistributor
          }
          onLevelChange={handleLevelChange}
          onReady={handleLevelReady}
        />
      </LevelIndicatorContainer>
      {isBannerVisible && (
        <AlertContainer>
          <Banner
            title={t("leveling.title")}
            bottomTitle={t("leveling.description")}
            buttonText={t("leveling.button")}
            centerComponent={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={resolveSvg("phone_position")}
                  alt="Phone Position"
                  style={{
                    width: "var(--illustration-size)",
                    height: "var(--illustration-size)",
                  }}
                />
              </div>
            }
            onButtonClick={handleDismissBanner}
          />
        </AlertContainer>
      )}
      {!isBannerVisible && levelValue && (
        <TopBannerContainer>
          <Banner
            type={BannerType.TOP}
            title={levelValue === Level.LEVEL ? getLevelTitle(levelValue) : ""}
            centerComponent={getLevelIcon(levelValue)}
            bottomTitle={
              levelValue !== Level.LEVEL ? getLevelTitle(levelValue) : undefined
            }
          />
        </TopBannerContainer>
      )}
    </ScreenContainer>
  );
};

export default LevelScreen;

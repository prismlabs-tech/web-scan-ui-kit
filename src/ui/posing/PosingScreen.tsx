import AnimatedProgressCheckmarkView from "@components/AnimatedProgressCheckmarkView";
import Banner, {
  AlertContainer,
  BannerType,
  TopBannerContainer,
} from "@components/Banner";
import { CenteredComponentContainer } from "@components/CenteredComponentContainer";
import ScreenContainer from "@components/ScreenContainer";
import {
  DetectionFeedback,
  DetectionFeedbackType,
  PrismSession,
  PrismSessionState,
} from "@prismlabs/web-scan-core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resolveSvg } from "../../assets/assetRegistry";
import { getDetectionFeedbackLocalization } from "../../localization/detection-feedback-localization";
import { PoseOverlay } from "./pose-overlay";
import { PosingSpeechManager } from "./posing-speech-manager";
import {
  PosingState,
  PosingStateDistributor,
  PosingStateType,
} from "./posing-state-distributor";
import { drawSkeleton } from "./skelton-drawing-utils";

interface BannerFeedbackProps {
  detectionFeedback: DetectionFeedback;
}

const BannerFeedback: React.FC<BannerFeedbackProps> = ({
  detectionFeedback,
}) => {
  const getPoseTitle = (feedback: DetectionFeedback): string => {
    return getDetectionFeedbackLocalization(feedback);
  };

  const getPosingIcon = (
    feedback: DetectionFeedback
  ): React.ReactNode | undefined => {
    switch (feedback.type) {
      case DetectionFeedbackType.Approved:
        return <AnimatedProgressCheckmarkView />;

      default:
        return undefined; // Replace with actual icon component
    }
  };

  return (
    <TopBannerContainer>
      <Banner
        type={BannerType.TOP}
        title=""
        centerComponent={getPosingIcon(detectionFeedback)}
        bottomTitle={getPoseTitle(detectionFeedback)}
      />
    </TopBannerContainer>
  );
};

interface PosingScreenProps {
  prismSession: PrismSession;
}

const PosingScreen: React.FC<PosingScreenProps> = ({ prismSession }) => {
  const { t } = useTranslation();

  const [posingState, setPosingState] = useState<PosingState>(
    PosingState.starting
  );
  const [isBannerVisible, setBannerVisible] = useState<boolean>(true);
  const [isFeedbackVisible, setFeedbackVisible] = useState<boolean>(false);
  const [isCheckmarkVisible, setCheckmarkVisible] = useState<boolean>(false);

  const distributorRef = React.useRef<PosingStateDistributor | null>(null);
  if (!distributorRef.current) {
    distributorRef.current = new PosingStateDistributor(
      prismSession.captureSession.positionReadinessDistributor,
      prismSession.captureSession.poseReadinessDistributor
    );
  }
  const distributor = distributorRef.current!;

  const posingSpeechManagerRef = React.useRef<PosingSpeechManager | null>(null);
  if (!posingSpeechManagerRef.current) {
    posingSpeechManagerRef.current = new PosingSpeechManager(distributor, t);
  }
  const posingSpeechManager = posingSpeechManagerRef.current!;

  useEffect(() => {
    const subscription = distributor.posingState.subscribe({
      next: (state) => {
        setPosingState(state);
      },
      error: (error) => {
        console.error("Error in posing state distributor:", error);
      },
    });

    distributor.start(); // start the state distributor
    posingSpeechManager.start();

    return () => {
      posingSpeechManager.stop(); // Stop speech manager on unmount
      distributor.dispose();
      subscription.unsubscribe(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const isBannerVisible: boolean =
      posingState.type === PosingStateType.Starting;
    setBannerVisible(isBannerVisible);

    const isFeedbackVisible: boolean =
      posingState.type === PosingStateType.Assisting ||
      posingState.type === PosingStateType.VerifyingConsistency;
    setFeedbackVisible(isFeedbackVisible);

    const isCheckmarkVisible: boolean =
      posingState.type === PosingStateType.VerifyingConsistency;
    setCheckmarkVisible(isCheckmarkVisible);
  }, [posingState.type]);

  const handleAnimationFinished = () => {
    prismSession.continueFrom(PrismSessionState.POSING);
  };

  return (
    <ScreenContainer>
      <PoseOverlay
        posingState={posingState}
        prismSession={prismSession}
        drawSkeleton={drawSkeleton}
      />
      {isBannerVisible && (
        <AlertContainer>
          <Banner
            title={t("posing.title")}
            type={BannerType.CENTER}
            centerComponent={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={resolveSvg("get_in_a_pose")}
                  alt="Pose Position"
                  style={{
                    width: "var(--illustration-size)",
                    height: "var(--illustration-size)",
                  }}
                />
              </div>
            }
          />
        </AlertContainer>
      )}
      {isFeedbackVisible && posingState.detectionFeedback && (
        <BannerFeedback detectionFeedback={posingState.detectionFeedback} />
      )}
      {isCheckmarkVisible && (
        <CenteredComponentContainer>
          <AnimatedProgressCheckmarkView
            onAnimationComplete={handleAnimationFinished}
            duration={2000}
          />
        </CenteredComponentContainer>
      )}
    </ScreenContainer>
  );
};

export default PosingScreen;

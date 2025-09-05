import AnimatedProgressCheckmarkView from "@components/AnimatedProgressCheckmarkView";
import Banner, {
  AlertContainer,
  BannerType,
  TopBannerContainer,
} from "@components/Banner";
import CameraViewfinder from "@components/CameraViewfinder";
import { CenteredComponentContainer } from "@components/CenteredComponentContainer";
import ScreenContainer from "@components/ScreenContainer";
import {
  DetectionFailure,
  DetectionFeedback,
  DetectionFeedbackType,
  PrismSession,
  PrismSessionState,
} from "@prismlabs/web-scan-core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resolveSvg } from "../../assets/assetRegistry";
import { getDetectionFeedbackLocalization } from "../../localization/detection-feedback-localization";
import { YellowIcon, YellowIconType } from "../components";
import CameraOutline, { OutlineState } from "../components/CameraOutline";
import ErrorView from "../components/ErrorView";
import { PositionSpeechManager } from "./position-speech-manager";
import {
  PositioningState,
  PositioningStateDistributor,
  PositioningStateType,
} from "./positioning-state-distributor";

interface BannerFeedbackProps {
  detectionFeedback: DetectionFeedback;
}

const BannerFeedback: React.FC<BannerFeedbackProps> = ({
  detectionFeedback,
}) => {
  const getPositionTitle = (feedback: DetectionFeedback): string => {
    return getDetectionFeedbackLocalization(feedback);
  };

  const getPositionIcon = (
    feedback: DetectionFeedback
  ): React.ReactNode | undefined => {
    switch (feedback.type) {
      case DetectionFeedbackType.EmptyFrame:
      case DetectionFeedbackType.IncompleteData:
      case DetectionFeedbackType.MultiplePeople:
        return <ErrorView />;
      case DetectionFeedbackType.Failed:
        switch (feedback.detectionFailure) {
          case DetectionFailure.TOO_FAR:
            return <YellowIcon icon={YellowIconType.ArrowDown} />;
          case DetectionFailure.TOO_CLOSE:
            return <YellowIcon icon={YellowIconType.ArrowUp} />;
          case DetectionFailure.TOO_FAR_LEFT:
            return <YellowIcon icon={YellowIconType.ArrowRight} />;
          case DetectionFailure.TOO_FAR_RIGHT:
            return <YellowIcon icon={YellowIconType.ArrowLeft} />;
          case DetectionFailure.BACKWARD:
            return <ErrorView />;
          case DetectionFailure.CAMERA_TOO_HIGH:
          case DetectionFailure.EMPTY_SPACE_TOP:
            return <YellowIcon icon={YellowIconType.MoveCameraUp} />;
          case DetectionFailure.CAMERA_TOO_LOW:
          case DetectionFailure.EMPTY_SPACE_BOTTOM:
            return <YellowIcon icon={YellowIconType.MoveCameraDown} />;
          default:
            return <ErrorView />;
        }
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
        centerComponent={getPositionIcon(detectionFeedback)}
        bottomTitle={getPositionTitle(detectionFeedback)}
      />
    </TopBannerContainer>
  );
};

interface PositionScreenProps {
  prismSession: PrismSession;
}

const PositionScreen: React.FC<PositionScreenProps> = ({ prismSession }) => {
  const { t } = useTranslation();
  const distributorRef = React.useRef<PositioningStateDistributor | null>(null);
  if (!distributorRef.current) {
    distributorRef.current = new PositioningStateDistributor(
      prismSession.captureSession.positionReadinessDistributor
    );
  }
  const distributor = distributorRef.current!;

  const positionSpeechManagerRef = React.useRef<PositionSpeechManager | null>(
    null
  );
  if (!positionSpeechManagerRef.current) {
    positionSpeechManagerRef.current = new PositionSpeechManager(
      distributor,
      t
    );
  }
  const positionSpeechManager = positionSpeechManagerRef.current!;

  const [positioningState, setPositioningState] = useState<PositioningState>(
    PositioningState.starting
  );

  const [isBannerVisible, setBannerVisible] = useState<boolean>(true);
  const [isFeedbackVisible, setFeedbackVisible] = useState<boolean>(false);
  const [isCheckmarkVisible, setCheckmarkVisible] = useState<boolean>(false);

  // Determine outline state based on detection feedback
  const getOutlineState = (): OutlineState => {
    if (!positioningState.detectionFeedback) {
      return OutlineState.Clear;
    }

    const feedbackType = positioningState.detectionFeedback.type;

    // Clear state for no person detected
    if (
      feedbackType === DetectionFeedbackType.EmptyFrame ||
      feedbackType === DetectionFeedbackType.IncompleteData
    ) {
      return OutlineState.Error;
    }

    // Success state for approved
    if (feedbackType === DetectionFeedbackType.Approved) {
      return OutlineState.Success;
    }

    // Error state for all other cases (MultiplePeople, Failed)
    return OutlineState.Error;
  };

  useEffect(() => {
    const subscription = distributor.positioningState.subscribe({
      next: (state) => {
        setPositioningState(state);
      },
      error: (error) => {
        console.error("Error in positioning state distributor:", error);
      },
    });

    distributor.start(); // start the state distributor
    positionSpeechManager.start(); // Start the speech manager

    return () => {
      positionSpeechManager.stop(); // Stop the speech manager on unmount
      distributor.dispose();
      subscription.unsubscribe(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const isBannerVisible: boolean =
      positioningState.type === PositioningStateType.Starting;
    setBannerVisible(isBannerVisible);

    const isFeedbackVisible: boolean =
      positioningState.type === PositioningStateType.Assisting ||
      positioningState.type === PositioningStateType.VerifyingConsistency;
    setFeedbackVisible(isFeedbackVisible);

    const isCheckmarkVisible: boolean =
      positioningState.type === PositioningStateType.VerifyingConsistency;
    setCheckmarkVisible(isCheckmarkVisible);
  }, [positioningState.type]);

  const handleAnimationFinished = () => {
    prismSession.continueFrom(PrismSessionState.POSITIONING);
  };

  return (
    <ScreenContainer>
      <CameraOutline $outlineState={getOutlineState()} />
      <CameraViewfinder size={250} />
      {isBannerVisible && (
        <AlertContainer>
          <Banner
            title={t("positioning.title")}
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
                  src={resolveSvg("body_scan_large")}
                  alt="User Position"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
            }
          />
        </AlertContainer>
      )}
      {isFeedbackVisible && positioningState.detectionFeedback && (
        <BannerFeedback
          detectionFeedback={positioningState.detectionFeedback}
        />
      )}

      {isCheckmarkVisible && (
        <CenteredComponentContainer>
          <AnimatedProgressCheckmarkView
            onAnimationComplete={handleAnimationFinished}
            duration={2500}
          />
        </CenteredComponentContainer>
      )}
    </ScreenContainer>
  );
};

export default PositionScreen;

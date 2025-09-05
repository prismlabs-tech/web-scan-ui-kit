import Banner, { AlertContainer, BannerType } from "@components/Banner";
import { CenteredComponentContainer } from "@components/CenteredComponentContainer";
import PieProgress from "@components/PieProgress";
import ScreenContainer from "@components/ScreenContainer";
import { PrismSession } from "@prismlabs/web-scan-core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { resolveSvg } from "../../assets/assetRegistry";
import { RecordingSpeechManager } from "./recording-speech-manager";
import {
  RecordingState,
  RecordingStateDistributor,
  RecordingStateType,
} from "./recording-state-distributor";

export const CountdownText = styled.div`
  color: white;
  font-size: 100px;
  font-family: var(--font-family);
  text-transform: uppercase;
  font-weight: bold;
`;

interface CountdownProps {
  countdown: number | undefined;
}

const PreparationCountdown: React.FC<CountdownProps> = ({ countdown }) => {
  const { t } = useTranslation();
  const countdownText = (() => {
    if (countdown === undefined) {
      return;
    }
    if (countdown > 1) {
      return t("recording.text.ready");
    }

    return t("recording.text.spin");
  })();

  return countdownText && <CountdownText>{countdownText}</CountdownText>;
};

interface RecordingScreenProps {
  prismSession: PrismSession;
}

const RecordingScreen: React.FC<RecordingScreenProps> = ({ prismSession }) => {
  const { t } = useTranslation();

  const [recordingState, setRecordingState] = useState<RecordingState | null>(
    null
  );

  const distributorRef = React.useRef<RecordingStateDistributor | null>(null);
  if (!distributorRef.current) {
    distributorRef.current = new RecordingStateDistributor(prismSession);
  }
  const distributor = distributorRef.current!;

  const recordingSpeechManagerRef = React.useRef<RecordingSpeechManager | null>(
    null
  );
  if (!recordingSpeechManagerRef.current) {
    recordingSpeechManagerRef.current = new RecordingSpeechManager(
      distributor,
      t
    );
  }
  const recordingSpeechManager = recordingSpeechManagerRef.current!;

  const [isBannerVisible, setBannerVisible] = useState<boolean>(true);
  const [isRecordingCountdownVisible, setRecordingCountdownVisible] =
    useState<boolean>(false);
  const [isPreparationCountdownVisible, setPreparationCountdownVisible] =
    useState<boolean>(false);
  const [recordingPieProgress, setRecordingPieProgress] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    const subscription = distributor.recordingState.subscribe({
      next: (state) => {
        setRecordingState(state);
      },
      error: (error) => {
        console.error("Error in recording state distributor:", error);
      },
    });

    distributor.start();
    recordingSpeechManager.start();

    return () => {
      recordingSpeechManager.stop(); // Stop speech manager on unmount
      distributor.dispose();
      subscription.unsubscribe(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const isBannerVisible: boolean =
      recordingState?.type === RecordingStateType.Starting;
    setBannerVisible(isBannerVisible);

    const isPreparationCountdownVisible: boolean =
      recordingState?.type === RecordingStateType.Preparing;
    setPreparationCountdownVisible(isPreparationCountdownVisible);

    const isRecordingCountdownVisible: boolean =
      recordingState?.type === RecordingStateType.Recording;
    setRecordingCountdownVisible(isRecordingCountdownVisible);
  }, [recordingState?.type]);

  useEffect(() => {
    if (recordingState?.type !== RecordingStateType.Recording) {
      return;
    }
    const remaining = recordingState?.countdown;
    if (remaining === undefined) {
      setRecordingPieProgress(undefined);
      return;
    }
    const total = 10; // matches RecordingStateDistributor's _recordingTimer(10)
    // The distributor counts down from N..0, we want a 1..0 proportion for the pie
    const pieProgress = Math.max(0, Math.min(1, remaining / total));
    setRecordingPieProgress(pieProgress);
  }, [recordingState?.countdown]);

  return (
    <ScreenContainer>
      {isBannerVisible && (
        <AlertContainer>
          <Banner
            title={t("recording.title")}
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
                  src={resolveSvg("spin")}
                  alt="Spin Icon"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
            }
          />
        </AlertContainer>
      )}
      {isPreparationCountdownVisible && (
        <CenteredComponentContainer>
          <PreparationCountdown countdown={recordingState?.countdown} />
        </CenteredComponentContainer>
      )}
      {isRecordingCountdownVisible && (
        <CenteredComponentContainer>
          <div style={{ display: "grid", gap: 20, placeItems: "center" }}>
            {recordingPieProgress !== undefined && (
              <PieProgress
                size={180}
                ringWidth={12}
                progress={recordingPieProgress}
              />
            )}
          </div>
        </CenteredComponentContainer>
      )}
    </ScreenContainer>
  );
};

export default RecordingScreen;

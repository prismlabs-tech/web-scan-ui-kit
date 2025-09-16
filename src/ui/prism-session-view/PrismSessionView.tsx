import {
  CameraPermissionState,
  CaptureSession,
  PrismSession,
  PrismSessionState,
} from "@prismlabs/web-scan-core";
import { isMobile } from "@tensorflow/tfjs-core/dist/device_util";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dispatchScanComplete } from "../../dispatch";
import "../../i18n/i18n";
import CameraFeed from "../camera/CameraFeed";
import { AlertContainer } from "../components";
import Banner from "../components/Banner";
import ScreenContainer from "../components/ScreenContainer";
import LevelScreen from "../level/LevelScreen";
import Modal, { ModalContentContainer } from "../modal/Modal";
import PosingScreen from "../posing/PosingScreen";
import PositionScreen from "../positioning/PositionScreen";
import ProcessingScreen from "../processing/ProcessingScreen";
import RecordingScreen from "../recording/RecordingScreen";

interface PrismSessionViewProps {
  onSessionStateChange?: (state: PrismSessionState) => void;
  onClose: () => void;
}

function getIsPortraitMobile() {
  return (
    isMobile(window.navigator) && window.screen.height > window.screen.width
  );
}

export function PrismSessionView({
  onSessionStateChange,
  onClose,
}: PrismSessionViewProps) {
  const { t } = useTranslation();
  const isFirefox =
    typeof navigator !== "undefined" &&
    /firefox|fxios/i.test(navigator.userAgent);
  const [isPortraitMobile, setIsPortraitMobile] = useState(
    getIsPortraitMobile()
  );
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState<Error | undefined>();
  const [scanBlob, setScanBlob] = useState<Blob | undefined>();
  const [sessionState, setSessionState] = useState<PrismSessionState>(
    PrismSessionState.IDLE
  );
  const [prismSession] = useState(() => {
    const captureSession = new CaptureSession();
    return new PrismSession(captureSession);
  });
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  function handleFirefoxPermissionIssues(error: any) {
    const err = error as any;
    const name = err?.name || "";
    const message = (err?.message || "").toLowerCase();

    // Detect permission-denied patterns across browsers (including Firefox)
    const isPermissionDenied =
      name === "NotAllowedError" ||
      name === "SecurityError" ||
      message.includes("not allowed") ||
      message.includes("permission") ||
      message.includes("denied");

    if (isPermissionDenied) {
      setHasCameraPermission(false);
    }
  }

  useEffect(() => {
    if (!isVideoReady || !isSessionInitialized) {
      return;
    }

    if (sessionState === PrismSessionState.IDLE) {
      prismSession.continue();
    }
  }, [isVideoReady, isSessionInitialized]);

  useEffect(() => {
    if (onSessionStateChange) {
      onSessionStateChange(sessionState);
    }
  }, [sessionState, onSessionStateChange]);

  useEffect(() => {
    const handleResize = () => setIsPortraitMobile(getIsPortraitMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const subscription = prismSession.currentSessionState.subscribe((state) => {
      setSessionState(state);
    });

    // Start the session automatically
    prismSession
      .init(isPortraitMobile)
      .then(() => {
        setIsSessionInitialized(true);
      })
      .catch((error) => {
        handleFirefoxPermissionIssues(error);
        setCameraError(error);
        console.error("Error starting Prism session:", error);
      })
      .finally(() => {
        const granted =
          prismSession.captureSession.cameraManager.isPermissionGranted;
        if (granted === true) {
          setHasCameraPermission(true);
        }
      });

    // Listen for camera permission changes
    prismSession.captureSession.cameraManager.onPermissionChange = (
      state: CameraPermissionState
    ) => {
      if (state === CameraPermissionState.Unknown) return;
      setHasCameraPermission(state !== CameraPermissionState.Denied);
    };

    const recordingSubscription =
      prismSession.captureSession.recorder.recording$.subscribe((blob) => {
        setScanBlob(blob);
      });

    return () => {
      subscription.unsubscribe();
      recordingSubscription.unsubscribe();
      prismSession.cancel();
    };
  }, [prismSession]);

  const handleCancel = () => {
    prismSession.cancel();
    onClose();
  };

  const handleVideoReady = async (video: HTMLVideoElement) => {
    try {
      await prismSession.captureSession.cameraManager.startVideoPlayback(video);
      setIsVideoReady(true);

      // THIS IS A FIREFOX FIX \\
      // If playback started successfully, permission is effectively granted (helps Firefox)
      setHasCameraPermission(true);
    } catch (error) {
      handleFirefoxPermissionIssues(error);
      setCameraError(error as Error);
      console.error("Camera error:", error);
    }
  };

  const endSession = () => {
    prismSession.completeSession();
    setIsSessionInitialized(false);
    setIsVideoReady(false);
    onClose();

    // notify that the scan is complete
    dispatchScanComplete(scanBlob);
  };

  return (
    <Modal
      isOpen={true}
      isMobile={isPortraitMobile}
      onRequestClose={handleCancel}
    >
      <ModalContentContainer isMobile={isPortraitMobile} onClose={handleCancel}>
        {/* Camera feed as background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "white",
          }}
        >
          {isSessionInitialized && (
            <CameraFeed
              cameraManager={prismSession.captureSession.cameraManager}
              onVideoReady={handleVideoReady}
            />
          )}
        </div>
        {/* Foreground content */}
        {cameraError ? (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "20px",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1>Error accessing the camera feed</h1>
            {hasCameraPermission === false ? (
              <p>Please enable camera permissions</p>
            ) : (
              <p>{cameraError.message}</p>
            )}
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "20px",
              height: "100%",
              maxHeight: "100%" /* Restrict height to fit within modal */,
              maxWidth: "100%" /* Restrict width to fit within modal */,
              overflow:
                "auto" /* Allow scrolling if content exceeds modal size */,
              boxSizing: "border-box" /* Include padding in dimensions */,
            }}
          >
            {sessionState === PrismSessionState.LEVELING && (
              <LevelScreen prismSession={prismSession} />
            )}

            {sessionState === PrismSessionState.POSITIONING && (
              <PositionScreen prismSession={prismSession} />
            )}

            {sessionState === PrismSessionState.POSING && (
              <PosingScreen prismSession={prismSession} />
            )}

            {sessionState === PrismSessionState.RECORDING && (
              <RecordingScreen prismSession={prismSession} />
            )}

            {sessionState === PrismSessionState.PROCESSING && (
              <ProcessingScreen onClose={endSession} />
            )}

            {sessionState === PrismSessionState.FINISHED && (
              <div>
                <h3>{t("prism.finished.title")}</h3>
                <p>{t("prism.finished.description")}</p>
                <button
                  onClick={endSession}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginTop: "20px",
                  }}
                >
                  {t("prism.finished.viewResults")}
                </button>
              </div>
            )}
            {hasCameraPermission === false && !isFirefox && (
              <ScreenContainer>
                <AlertContainer>
                  <Banner
                    title={t("cameraError.title")}
                    bottomTitle={t("cameraError.description")}
                    buttonText={t("cameraError.button")}
                    onButtonClick={() => {
                      setHasCameraPermission(null);
                      onClose();
                    }}
                  />
                </AlertContainer>
              </ScreenContainer>
            )}
          </div>
        )}
      </ModalContentContainer>
    </Modal>
  );
}

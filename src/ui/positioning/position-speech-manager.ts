import { TFunction } from "i18next/typescript/t";
import { Subscription } from "rxjs";
import { getDetectionFeedbackVoiceLocalization } from "../../localization/detection-feedback-localization";
import { SpeechSynthesizer } from "../../shared/SpeechSynthesizer";
import {
  PositioningState,
  PositioningStateDistributor,
  PositioningStateType,
} from "./positioning-state-distributor";

export class PositionSpeechError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PositionSpeechError";
  }
}

export class PositionSpeechManager {
  private speechSynthesizer: SpeechSynthesizer = new SpeechSynthesizer();
  private positioningStateDistributor: PositioningStateDistributor;
  private subscription: Subscription | null = null;
  private localization: TFunction<"translation", undefined>;

  constructor(
    positioningStateDistributor: PositioningStateDistributor,
    t: TFunction<"translation", undefined>
  ) {
    this.positioningStateDistributor = positioningStateDistributor;
    this.localization = t;
    this.positioningStateDistributor = positioningStateDistributor;
  }

  start(): PositionSpeechManager {
    if (this.subscription !== null) {
      throw new PositionSpeechError(
        "Position Speech Manager was already started"
      );
    }

    // Subscribe to positioning state changes and trigger speech
    this.subscription =
      this.positioningStateDistributor.positioningState.subscribe(
        (state: PositioningState) => {
          switch (state.type) {
            case PositioningStateType.Starting:
              this.speechSynthesizer.speak(
                this.localization("positioning.voice.prepare")
              );
              break;

            case PositioningStateType.Assisting:
              if (state.detectionFeedback) {
                this.speechSynthesizer.speak(
                  getDetectionFeedbackVoiceLocalization(
                    state.detectionFeedback,
                    this.localization
                  )
                );
              }
              break;

            case PositioningStateType.VerifyingConsistency:
              this.speechSynthesizer.speak(
                this.localization("positioning.voice.complete")
              );
              break;
          }
        }
      );

    return this;
  }

  stop(): void {
    if (this.subscription === null) {
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = null;
    this.speechSynthesizer.cancel();
  }
}

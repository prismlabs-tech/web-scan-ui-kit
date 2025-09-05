import { SpeechSynthesizer } from "@prismlabs/web-scan-core";
import { TFunction } from "i18next";
import { Subscription } from "rxjs";
import { getDetectionFeedbackVoiceLocalization } from "../../localization/detection-feedback-localization";
import {
  PosingState,
  PosingStateDistributor,
  PosingStateType,
} from "./posing-state-distributor";

export class PosingSpeechError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PosingSpeechError";
  }
}

export class PosingSpeechManager {
  private speechSynthesizer: SpeechSynthesizer = new SpeechSynthesizer("en-US");
  private posingStateDistributor: PosingStateDistributor;
  private subscription: Subscription | null = null;
  private localization: TFunction<"translation", undefined>;

  constructor(
    posingStateDistributor: PosingStateDistributor,
    t: TFunction<"translation", undefined>
  ) {
    this.posingStateDistributor = posingStateDistributor;
    this.localization = t;
  }

  start(): PosingSpeechManager {
    if (this.subscription !== null) {
      throw new PosingSpeechError("Posing Speech Manager was already started");
    }

    // Subscribe to positioning state changes and trigger speech
    this.subscription = this.posingStateDistributor.posingState.subscribe(
      (state: PosingState) => {
        switch (state.type) {
          case PosingStateType.Starting:
            this.speechSynthesizer.speak(
              this.localization("posing.voice.prepare")
            );
            break;

          case PosingStateType.Assisting:
            if (state.detectionFeedback) {
              this.speechSynthesizer.speak(
                getDetectionFeedbackVoiceLocalization(
                  state.detectionFeedback,
                  this.localization
                )
              );
            }
            break;

          case PosingStateType.VerifyingConsistency:
            break;
        }
      }
    );

    return this;
  }

  stop(): PosingSpeechManager {
    if (this.subscription === null) {
      throw new PosingSpeechError("Posing Speech Manager was not started");
    }
    this.subscription.unsubscribe();
    this.subscription = null;
    return this;
  }
}

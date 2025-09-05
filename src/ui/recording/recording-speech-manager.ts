import { SpeechSynthesizer } from "@prismlabs/web-scan-core";
import { TFunction } from "i18next";
import { Subscription } from "rxjs";
import {
  RecordingState,
  RecordingStateDistributor,
  RecordingStateType,
} from "./recording-state-distributor";

export class RecordingSpeechError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecordingSpeechError";
  }
}

export class RecordingSpeechManager {
  private speechSynthesizer: SpeechSynthesizer = new SpeechSynthesizer("en-US");
  private recordingStateDistributor: RecordingStateDistributor;
  private subscription: Subscription | null = null;
  private localization: TFunction<"translation", undefined>;
  private lastSpokenCountdown: number | null = null;

  constructor(
    recordingStateDistributor: RecordingStateDistributor,
    t: TFunction<"translation", undefined>
  ) {
    this.recordingStateDistributor = recordingStateDistributor;
    this.localization = t;
  }

  start(): RecordingSpeechManager {
    if (this.subscription !== null) {
      throw new RecordingSpeechError(
        "Recording Speech Manager was already started"
      );
    }

    // Subscribe to recording state changes and trigger speech
    this.subscription = this.recordingStateDistributor.recordingState.subscribe(
      (state: RecordingState) => {
        switch (state.type) {
          case RecordingStateType.Starting:
            this.speechSynthesizer.speak(
              this.localization("recording.voice.prepare")
            );
            break;

          case RecordingStateType.Preparing:
            this.handlePreparationCountdown(state.countdown);
            break;

          case RecordingStateType.Recording:
            this.handleRecordingCountdown(state.countdown);
            break;
        }
      }
    );

    return this;
  }

  private handlePreparationCountdown(countdown: number | undefined): void {
    if (countdown === undefined) {
      return;
    }

    if (countdown === 2) {
      this.speechSynthesizer.speak(this.localization("recording.voice.ready"));
    } else if (countdown === 1) {
      this.speechSynthesizer.speak(this.localization("recording.voice.spin"));
    }
  }

  private handleRecordingCountdown(countdown: number | undefined): void {
    if (countdown === undefined) {
      return;
    }

    // Only speak each countdown number once
    if (this.lastSpokenCountdown === countdown) {
      return;
    }

    this.lastSpokenCountdown = countdown;

    if (countdown > 0) {
      // Speak the countdown number
      this.speechSynthesizer.speak(countdown.toString());
    } else {
      this.speechSynthesizer.speak(
        this.localization("recording.voice.finished")
      );
    }
  }

  stop(): RecordingSpeechManager {
    if (this.subscription === null) {
      throw new RecordingSpeechError(
        "Recording Speech Manager was not started"
      );
    }
    this.subscription.unsubscribe();
    this.subscription = null;
    this.lastSpokenCountdown = null;
    return this;
  }
}

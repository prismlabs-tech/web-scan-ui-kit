import { PrismSession, PrismSessionState } from "@prismlabs/web-scan-core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { CountdownTimer } from "./countdown-timer";

export enum RecordingStateType {
  Starting,
  Preparing,
  Recording,
}

export class RecordingState {
  public readonly type: RecordingStateType;
  public readonly countdown?: number;

  private constructor(type: RecordingStateType, countdown?: number) {
    this.type = type;
    this.countdown = countdown;
  }

  static starting(): RecordingState {
    return new RecordingState(RecordingStateType.Starting);
  }

  static preparing(countdown: number): RecordingState {
    return new RecordingState(RecordingStateType.Preparing, countdown);
  }

  static recording(countdown: number): RecordingState {
    return new RecordingState(RecordingStateType.Recording, countdown);
  }
}

/**
 * Distributor of Recording Assistant state
 *
 * This class facilitates moving through the different states of the recording stage: start,
 * preparation, countdown, and recording—and maps them to a flow of distinct RecordingStates.
 * It also handles some of the prism session logic that runs based on these timers, including
 * starting and stopping the recorder.
 */
export class RecordingStateDistributor {
  private readonly _recordingStateFlow = new BehaviorSubject<RecordingState>(
    RecordingState.starting()
  );

  private _startingTimeout: any | undefined = undefined; // this uses `any` because Node and Browser have different types for timeouts
  private _preparationTimer: CountdownTimer = new CountdownTimer(2);
  private _recordingTimer: CountdownTimer = new CountdownTimer(10);

  private subscriptions: Subscription[] = [];

  private _isStarted = false;

  public get isStarted() {
    return this._isStarted;
  }

  public readonly recordingState: Observable<RecordingState>;

  constructor(private readonly prismSession: PrismSession) {
    this.recordingState = this._recordingStateFlow.pipe(shareReplay(1));

    this.initializeSubscriptions();
    this.setupTimers();
  }

  start(): void {
    if (this.isStarted) {
      console.warn("RecordingStateDistributor already started");
      return;
    }
    this._isStarted = true;

    this.updateRecordingState(RecordingState.starting());

    // Manage timing of the RecordingState.Starting phase
    this._startingTimeout = setTimeout(() => {
      this._preparationTimer.start();
    }, 3500);
  }

  dispose(): void {
    this._recordingStateFlow.complete();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.cancelTimers();
  }

  private cancelTimers(): void {
    this._startingTimeout && clearTimeout(this._startingTimeout);
    this._preparationTimer.cancel();
    this._recordingTimer.cancel();
  }

  private initializeSubscriptions(): void {
    const stateSubscription = this.prismSession.currentSessionState.subscribe(
      (state) => {
        if (state !== PrismSessionState.RECORDING) {
          this.dispose();
        }
      }
    );

    this.subscriptions.push(stateSubscription);
  }

  private setupTimers(): void {
    this._preparationTimer.onTick = (count: number) => {
      this.updateRecordingState(RecordingState.preparing(count));
      // start session recording one second early
      if (count === 1) {
        this.prismSession.captureSession.startRecording();
      }
    };

    this._recordingTimer.onTick = (count: number) => {
      this.updateRecordingState(RecordingState.recording(count));

      if (count === 0) {
        this.prismSession.captureSession.stopRecording();
      }
    };

    this._preparationTimer.onFinished = () => {
      this._recordingTimer.start();
    };

    this._recordingTimer.onFinished = () => {
      this.prismSession.continueFrom(PrismSessionState.RECORDING);
    };
  }

  private updateRecordingState(newRecordingState: RecordingState): void {
    this._recordingStateFlow.next(newRecordingState);
  }
}

import {
  checkDetectionFeedbackEquality,
  conditionalThrottle,
  DetectionFeedback,
  getDetectionFeedbackFromPoseResult,
  getDetectionFeedbackFromPositionResult,
  PoseReadinessDistributor,
  PoseResultType,
  PositionReadinessDistributor,
  PositionResultType,
} from "@prismlabs/web-scan-core";
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  takeUntil,
} from "rxjs";
import { shareReplay } from "rxjs/operators";

export enum PosingStateType {
  Starting,
  Assisting,
  VerifyingConsistency,
}

/**
 * DetectionFeedback returns the high-level results of the position and pose readiness check.
 */
export class PosingState {
  public readonly type: PosingStateType;
  public readonly detectionFeedback?: DetectionFeedback;

  private constructor(type: PosingStateType, feedback?: DetectionFeedback) {
    this.type = type;
    this.detectionFeedback = feedback;
  }

  static starting(): PosingState {
    return new PosingState(PosingStateType.Starting);
  }

  static assisting(feedback: DetectionFeedback): PosingState {
    return new PosingState(PosingStateType.Assisting, feedback);
  }

  static verifyingConsistency(): PosingState {
    return new PosingState(PosingStateType.VerifyingConsistency);
  }
}

/**
 * Distributor of Posing state
 *
 * This class facilitates taking in state information from the PositionReadinessDistributor &
 * PoseReadinessDistributor and mapping them down to a flow of distinct PositioningState.
 * Beyond that it also reacts to the distinct PositioningState and manages timing of
 * the PositioningState.Starting.
 */
export class PosingStateDistributor {
  private _starting = new BehaviorSubject<boolean>(true);
  private stop$ = new Subject<void>(); // Subject to signal the end of the posing session
  private _isStarted = false;
  private _startingTimeout: any | undefined = undefined; // this uses `any` because Node and Browser have different types for timeouts

  public get isStarted() {
    return this._isStarted;
  }

  public readonly posingState: Observable<PosingState>;

  constructor(
    positionReadinessDistributor: PositionReadinessDistributor,
    poseReadinessDistributor: PoseReadinessDistributor
  ) {
    this.posingState = combineLatest([
      positionReadinessDistributor.distinctReadiness,
      poseReadinessDistributor.distinctReadiness,
      this._starting,
    ]).pipe(
      map(([positionReadiness, poseReadiness, starting]) => {
        if (starting) {
          return PosingState.starting();
        } else {
          if (
            positionReadiness.result.type === PositionResultType.Approved &&
            poseReadiness.result.type === PoseResultType.Approved
          ) {
            return PosingState.verifyingConsistency();
          } else {
            if (positionReadiness.result.type !== PositionResultType.Approved) {
              return PosingState.assisting(
                getDetectionFeedbackFromPositionResult(positionReadiness.result)
              );
            } else {
              return PosingState.assisting(
                getDetectionFeedbackFromPoseResult(poseReadiness.result)
              );
            }
          }
        }
      }),
      conditionalThrottle(2500, true, (newState, oldState) => {
        // don't immediately switch errors while assisting
        return (
          newState.type === PosingStateType.Assisting &&
          oldState.type === PosingStateType.Assisting
        );
      }),
      distinctUntilChanged((oldState, newState) => {
        if (oldState.type !== newState.type) {
          return false;
        }

        switch (oldState.type) {
          case PosingStateType.Starting:
            return newState.type === PosingStateType.Starting;
          case PosingStateType.Assisting:
            if (newState.type === PosingStateType.Assisting) {
              return checkDetectionFeedbackEquality(
                oldState.detectionFeedback,
                newState.detectionFeedback
              );
            }
            return false;
          case PosingStateType.VerifyingConsistency:
            return newState.type === PosingStateType.VerifyingConsistency;
        }
      }),
      takeUntil(this.stop$),
      shareReplay(1)
    );
  }

  start() {
    if (this.isStarted) {
      console.warn("PosingStateDistributor already started");
      return;
    }
    this._isStarted = true;

    // Manage timing of the PosingState.Starting phase
    this._startingTimeout = setTimeout(() => {
      this._starting.next(false);
    }, 4500);
  }

  dispose() {
    this._startingTimeout && clearTimeout(this._startingTimeout);
    this.stop$.next();
    this.stop$.complete();
    this._starting.complete();
  }
}

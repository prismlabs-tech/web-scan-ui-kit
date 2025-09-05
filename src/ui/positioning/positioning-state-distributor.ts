import {
  checkDetectionFeedbackEquality,
  conditionalThrottle,
  DetectionFeedback,
  getDetectionFeedbackFromPositionResult,
  PositionReadinessDistributor,
  PositionResultType,
} from "@prismlabs/web-scan-core";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  takeUntil,
} from "rxjs";
import { distinctUntilChanged, map, shareReplay } from "rxjs/operators";

export enum PositioningStateType {
  Starting,
  Assisting,
  VerifyingConsistency,
}

/**
 * DetectionFeedback returns the high level results of the position and pose readiness check.
 */
export class PositioningState {
  public readonly type: PositioningStateType;
  public readonly detectionFeedback?: DetectionFeedback;

  private constructor(
    type: PositioningStateType,
    feedback?: DetectionFeedback
  ) {
    this.type = type;
    this.detectionFeedback = feedback;
  }

  static starting(): PositioningState {
    return new PositioningState(PositioningStateType.Starting);
  }

  static assisting(feedback: DetectionFeedback): PositioningState {
    return new PositioningState(PositioningStateType.Assisting, feedback);
  }

  static verifyingConsistency(): PositioningState {
    return new PositioningState(PositioningStateType.VerifyingConsistency);
  }
}

/**
 * Distributor of Positioning state
 *
 * This class facilitates taking in state information from the PositionReadinessDistributor
 * and mapping it to a flow of distinct PositioningState.
 * Beyond that it also reacts to the distinct PositioningState and manages timing of
 * the PositioningState.Starting.
 */
export class PositioningStateDistributor {
  private _starting = new BehaviorSubject<boolean>(true);
  private stop$ = new Subject<void>(); // Subject to signal the end of the positioning session
  private _isStarted = false;
  private _startingTimeout: any | undefined = undefined; // this uses `any` because Node and Browser have different types for timeouts

  public get isStarted() {
    return this._isStarted;
  }

  /**
   * The positioningState observable
   */
  public readonly positioningState: Observable<PositioningState>;

  constructor(positionReadinessDistributor: PositionReadinessDistributor) {
    this.positioningState = combineLatest([
      positionReadinessDistributor.readiness,
      this._starting,
    ]).pipe(
      map(([readiness, starting]) => {
        if (starting) {
          return PositioningState.starting();
        } else if (readiness.result.type === PositionResultType.Approved) {
          return PositioningState.verifyingConsistency();
        } else {
          return PositioningState.assisting(
            getDetectionFeedbackFromPositionResult(readiness.result)
          );
        }
      }),
      conditionalThrottle(2000, true, (newState, oldState) => {
        switch (newState.type) {
          case PositioningStateType.VerifyingConsistency:
          case PositioningStateType.Starting:
            return false;
          case PositioningStateType.Assisting:
            switch (oldState?.type) {
              case PositioningStateType.Starting:
                return false;
              case PositioningStateType.Assisting:
                // don't immediately switch errors while assisting
                return true;
              case PositioningStateType.VerifyingConsistency:
                return false;
              default:
                return false;
            }
          default:
            return false;
        }
      }),
      distinctUntilChanged((oldState, newState) => {
        switch (oldState.type) {
          case PositioningStateType.Starting:
            switch (newState.type) {
              case PositioningStateType.Starting:
                return true;
              default:
                return false;
            }
          case PositioningStateType.Assisting:
            switch (newState.type) {
              case PositioningStateType.Assisting:
                return checkDetectionFeedbackEquality(
                  oldState.detectionFeedback,
                  newState.detectionFeedback
                );
              default:
                return false;
            }
          case PositioningStateType.VerifyingConsistency:
            switch (newState.type) {
              case PositioningStateType.VerifyingConsistency:
                return true;
              default:
                return false;
            }
          default:
            return false;
        }
      }),
      takeUntil(this.stop$),
      shareReplay(1)
    );
  }

  start() {
    if (this.isStarted) {
      console.warn("PositioningStateDistributor already started");
      return;
    }
    this._isStarted = true;

    // Manage timing of the PositioningState.Starting phase
    this._startingTimeout = setTimeout(() => {
      this._starting.next(false);
    }, 4000);
  }

  dispose() {
    this._startingTimeout && clearTimeout(this._startingTimeout);
    this.stop$.next();
    this.stop$.complete();
    this._starting.complete();
  }
}

import { checkDetectionFeedbackEquality, conditionalThrottle, getDetectionFeedbackFromPoseResult, getDetectionFeedbackFromPositionResult, PoseResultType, PositionResultType, } from "@prismlabs/web-scan-core";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Subject, takeUntil, } from "rxjs";
import { shareReplay } from "rxjs/operators";
export var PosingStateType;
(function (PosingStateType) {
    PosingStateType[PosingStateType["Starting"] = 0] = "Starting";
    PosingStateType[PosingStateType["Assisting"] = 1] = "Assisting";
    PosingStateType[PosingStateType["VerifyingConsistency"] = 2] = "VerifyingConsistency";
})(PosingStateType || (PosingStateType = {}));
/**
 * DetectionFeedback returns the high-level results of the position and pose readiness check.
 */
var PosingState = /** @class */ (function () {
    function PosingState(type, feedback) {
        this.type = type;
        this.detectionFeedback = feedback;
    }
    PosingState.starting = function () {
        return new PosingState(PosingStateType.Starting);
    };
    PosingState.assisting = function (feedback) {
        return new PosingState(PosingStateType.Assisting, feedback);
    };
    PosingState.verifyingConsistency = function () {
        return new PosingState(PosingStateType.VerifyingConsistency);
    };
    return PosingState;
}());
export { PosingState };
/**
 * Distributor of Posing state
 *
 * This class facilitates taking in state information from the PositionReadinessDistributor &
 * PoseReadinessDistributor and mapping them down to a flow of distinct PositioningState.
 * Beyond that it also reacts to the distinct PositioningState and manages timing of
 * the PositioningState.Starting.
 */
var PosingStateDistributor = /** @class */ (function () {
    function PosingStateDistributor(positionReadinessDistributor, poseReadinessDistributor) {
        this._starting = new BehaviorSubject(true);
        this.stop$ = new Subject(); // Subject to signal the end of the posing session
        this._isStarted = false;
        this._startingTimeout = undefined; // this uses `any` because Node and Browser have different types for timeouts
        this.posingState = combineLatest([
            positionReadinessDistributor.distinctReadiness,
            poseReadinessDistributor.distinctReadiness,
            this._starting,
        ]).pipe(map(function (_a) {
            var positionReadiness = _a[0], poseReadiness = _a[1], starting = _a[2];
            if (starting) {
                return PosingState.starting();
            }
            else {
                if (positionReadiness.result.type === PositionResultType.Approved &&
                    poseReadiness.result.type === PoseResultType.Approved) {
                    return PosingState.verifyingConsistency();
                }
                else {
                    if (positionReadiness.result.type !== PositionResultType.Approved) {
                        return PosingState.assisting(getDetectionFeedbackFromPositionResult(positionReadiness.result));
                    }
                    else {
                        return PosingState.assisting(getDetectionFeedbackFromPoseResult(poseReadiness.result));
                    }
                }
            }
        }), conditionalThrottle(2500, true, function (newState, oldState) {
            // don't immediately switch errors while assisting
            return (newState.type === PosingStateType.Assisting &&
                oldState.type === PosingStateType.Assisting);
        }), distinctUntilChanged(function (oldState, newState) {
            if (oldState.type !== newState.type) {
                return false;
            }
            switch (oldState.type) {
                case PosingStateType.Starting:
                    return newState.type === PosingStateType.Starting;
                case PosingStateType.Assisting:
                    if (newState.type === PosingStateType.Assisting) {
                        return checkDetectionFeedbackEquality(oldState.detectionFeedback, newState.detectionFeedback);
                    }
                    return false;
                case PosingStateType.VerifyingConsistency:
                    return newState.type === PosingStateType.VerifyingConsistency;
            }
        }), takeUntil(this.stop$), shareReplay(1));
    }
    Object.defineProperty(PosingStateDistributor.prototype, "isStarted", {
        get: function () {
            return this._isStarted;
        },
        enumerable: false,
        configurable: true
    });
    PosingStateDistributor.prototype.start = function () {
        var _this = this;
        if (this.isStarted) {
            console.warn("PosingStateDistributor already started");
            return;
        }
        this._isStarted = true;
        // Manage timing of the PosingState.Starting phase
        this._startingTimeout = setTimeout(function () {
            _this._starting.next(false);
        }, 4500);
    };
    PosingStateDistributor.prototype.dispose = function () {
        this._startingTimeout && clearTimeout(this._startingTimeout);
        this.stop$.next();
        this.stop$.complete();
        this._starting.complete();
    };
    return PosingStateDistributor;
}());
export { PosingStateDistributor };

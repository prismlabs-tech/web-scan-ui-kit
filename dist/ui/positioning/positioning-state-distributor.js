import { checkDetectionFeedbackEquality, conditionalThrottle, getDetectionFeedbackFromPositionResult, PositionResultType, } from "@prismlabs/web-scan-core";
import { BehaviorSubject, combineLatest, Subject, takeUntil, } from "rxjs";
import { distinctUntilChanged, map, shareReplay } from "rxjs/operators";
export var PositioningStateType;
(function (PositioningStateType) {
    PositioningStateType[PositioningStateType["Starting"] = 0] = "Starting";
    PositioningStateType[PositioningStateType["Assisting"] = 1] = "Assisting";
    PositioningStateType[PositioningStateType["VerifyingConsistency"] = 2] = "VerifyingConsistency";
})(PositioningStateType || (PositioningStateType = {}));
/**
 * DetectionFeedback returns the high level results of the position and pose readiness check.
 */
var PositioningState = /** @class */ (function () {
    function PositioningState(type, feedback) {
        this.type = type;
        this.detectionFeedback = feedback;
    }
    PositioningState.starting = function () {
        return new PositioningState(PositioningStateType.Starting);
    };
    PositioningState.assisting = function (feedback) {
        return new PositioningState(PositioningStateType.Assisting, feedback);
    };
    PositioningState.verifyingConsistency = function () {
        return new PositioningState(PositioningStateType.VerifyingConsistency);
    };
    return PositioningState;
}());
export { PositioningState };
/**
 * Distributor of Positioning state
 *
 * This class facilitates taking in state information from the PositionReadinessDistributor
 * and mapping it to a flow of distinct PositioningState.
 * Beyond that it also reacts to the distinct PositioningState and manages timing of
 * the PositioningState.Starting.
 */
var PositioningStateDistributor = /** @class */ (function () {
    function PositioningStateDistributor(positionReadinessDistributor) {
        this._starting = new BehaviorSubject(true);
        this.stop$ = new Subject(); // Subject to signal the end of the positioning session
        this._isStarted = false;
        this._startingTimeout = undefined; // this uses `any` because Node and Browser have different types for timeouts
        this.positioningState = combineLatest([
            positionReadinessDistributor.readiness,
            this._starting,
        ]).pipe(map(function (_a) {
            var readiness = _a[0], starting = _a[1];
            if (starting) {
                return PositioningState.starting();
            }
            else if (readiness.result.type === PositionResultType.Approved) {
                return PositioningState.verifyingConsistency();
            }
            else {
                return PositioningState.assisting(getDetectionFeedbackFromPositionResult(readiness.result));
            }
        }), conditionalThrottle(2000, true, function (newState, oldState) {
            switch (newState.type) {
                case PositioningStateType.VerifyingConsistency:
                case PositioningStateType.Starting:
                    return false;
                case PositioningStateType.Assisting:
                    switch (oldState === null || oldState === void 0 ? void 0 : oldState.type) {
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
        }), distinctUntilChanged(function (oldState, newState) {
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
                            return checkDetectionFeedbackEquality(oldState.detectionFeedback, newState.detectionFeedback);
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
        }), takeUntil(this.stop$), shareReplay(1));
    }
    Object.defineProperty(PositioningStateDistributor.prototype, "isStarted", {
        get: function () {
            return this._isStarted;
        },
        enumerable: false,
        configurable: true
    });
    PositioningStateDistributor.prototype.start = function () {
        var _this = this;
        if (this.isStarted) {
            console.warn("PositioningStateDistributor already started");
            return;
        }
        this._isStarted = true;
        // Manage timing of the PositioningState.Starting phase
        this._startingTimeout = setTimeout(function () {
            _this._starting.next(false);
        }, 4000);
    };
    PositioningStateDistributor.prototype.dispose = function () {
        this._startingTimeout && clearTimeout(this._startingTimeout);
        this.stop$.next();
        this.stop$.complete();
        this._starting.complete();
    };
    return PositioningStateDistributor;
}());
export { PositioningStateDistributor };

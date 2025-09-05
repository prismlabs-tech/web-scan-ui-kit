import { PrismSessionState } from "@prismlabs/web-scan-core";
import { BehaviorSubject } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { CountdownTimer } from './countdown-timer.js';
export var RecordingStateType;
(function (RecordingStateType) {
    RecordingStateType[RecordingStateType["Starting"] = 0] = "Starting";
    RecordingStateType[RecordingStateType["Preparing"] = 1] = "Preparing";
    RecordingStateType[RecordingStateType["Recording"] = 2] = "Recording";
})(RecordingStateType || (RecordingStateType = {}));
var RecordingState = /** @class */ (function () {
    function RecordingState(type, countdown) {
        this.type = type;
        this.countdown = countdown;
    }
    RecordingState.starting = function () {
        return new RecordingState(RecordingStateType.Starting);
    };
    RecordingState.preparing = function (countdown) {
        return new RecordingState(RecordingStateType.Preparing, countdown);
    };
    RecordingState.recording = function (countdown) {
        return new RecordingState(RecordingStateType.Recording, countdown);
    };
    return RecordingState;
}());
export { RecordingState };
/**
 * Distributor of Recording Assistant state
 *
 * This class facilitates moving through the different states of the recording stage: start,
 * preparation, countdown, and recording—and maps them to a flow of distinct RecordingStates.
 * It also handles some of the prism session logic that runs based on these timers, including
 * starting and stopping the recorder.
 */
var RecordingStateDistributor = /** @class */ (function () {
    function RecordingStateDistributor(prismSession) {
        this.prismSession = prismSession;
        this._recordingStateFlow = new BehaviorSubject(RecordingState.starting());
        this._startingTimeout = undefined; // this uses `any` because Node and Browser have different types for timeouts
        this._preparationTimer = new CountdownTimer(2);
        this._recordingTimer = new CountdownTimer(10);
        this.subscriptions = [];
        this._isStarted = false;
        this.recordingState = this._recordingStateFlow.pipe(shareReplay(1));
        this.initializeSubscriptions();
        this.setupTimers();
    }
    Object.defineProperty(RecordingStateDistributor.prototype, "isStarted", {
        get: function () {
            return this._isStarted;
        },
        enumerable: false,
        configurable: true
    });
    RecordingStateDistributor.prototype.start = function () {
        var _this = this;
        if (this.isStarted) {
            console.warn("RecordingStateDistributor already started");
            return;
        }
        this._isStarted = true;
        this.updateRecordingState(RecordingState.starting());
        // Manage timing of the RecordingState.Starting phase
        this._startingTimeout = setTimeout(function () {
            _this._preparationTimer.start();
        }, 3500);
    };
    RecordingStateDistributor.prototype.dispose = function () {
        this._recordingStateFlow.complete();
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        this.cancelTimers();
    };
    RecordingStateDistributor.prototype.cancelTimers = function () {
        this._startingTimeout && clearTimeout(this._startingTimeout);
        this._preparationTimer.cancel();
        this._recordingTimer.cancel();
    };
    RecordingStateDistributor.prototype.initializeSubscriptions = function () {
        var _this = this;
        var stateSubscription = this.prismSession.currentSessionState.subscribe(function (state) {
            if (state !== PrismSessionState.RECORDING) {
                _this.dispose();
            }
        });
        this.subscriptions.push(stateSubscription);
    };
    RecordingStateDistributor.prototype.setupTimers = function () {
        var _this = this;
        this._preparationTimer.onTick = function (count) {
            _this.updateRecordingState(RecordingState.preparing(count));
            // start session recording one second early
            if (count === 1) {
                _this.prismSession.captureSession.startRecording();
            }
        };
        this._recordingTimer.onTick = function (count) {
            _this.updateRecordingState(RecordingState.recording(count));
            if (count === 0) {
                _this.prismSession.captureSession.stopRecording();
            }
        };
        this._preparationTimer.onFinished = function () {
            _this._recordingTimer.start();
        };
        this._recordingTimer.onFinished = function () {
            _this.prismSession.continueFrom(PrismSessionState.RECORDING);
        };
    };
    RecordingStateDistributor.prototype.updateRecordingState = function (newRecordingState) {
        this._recordingStateFlow.next(newRecordingState);
    };
    return RecordingStateDistributor;
}());
export { RecordingStateDistributor };

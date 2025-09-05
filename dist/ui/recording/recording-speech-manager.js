var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { SpeechSynthesizer } from "@prismlabs/web-scan-core";
import { RecordingStateType, } from './recording-state-distributor.js';
var RecordingSpeechError = /** @class */ (function (_super) {
    __extends(RecordingSpeechError, _super);
    function RecordingSpeechError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "RecordingSpeechError";
        return _this;
    }
    return RecordingSpeechError;
}(Error));
export { RecordingSpeechError };
var RecordingSpeechManager = /** @class */ (function () {
    function RecordingSpeechManager(recordingStateDistributor, t) {
        this.speechSynthesizer = new SpeechSynthesizer("en-US");
        this.subscription = null;
        this.lastSpokenCountdown = null;
        this.recordingStateDistributor = recordingStateDistributor;
        this.localization = t;
    }
    RecordingSpeechManager.prototype.start = function () {
        var _this = this;
        if (this.subscription !== null) {
            throw new RecordingSpeechError("Recording Speech Manager was already started");
        }
        // Subscribe to recording state changes and trigger speech
        this.subscription = this.recordingStateDistributor.recordingState.subscribe(function (state) {
            switch (state.type) {
                case RecordingStateType.Starting:
                    _this.speechSynthesizer.speak(_this.localization("recording.voice.prepare"));
                    break;
                case RecordingStateType.Preparing:
                    _this.handlePreparationCountdown(state.countdown);
                    break;
                case RecordingStateType.Recording:
                    _this.handleRecordingCountdown(state.countdown);
                    break;
            }
        });
        return this;
    };
    RecordingSpeechManager.prototype.handlePreparationCountdown = function (countdown) {
        if (countdown === undefined) {
            return;
        }
        if (countdown === 2) {
            this.speechSynthesizer.speak(this.localization("recording.voice.ready"));
        }
        else if (countdown === 1) {
            this.speechSynthesizer.speak(this.localization("recording.voice.spin"));
        }
    };
    RecordingSpeechManager.prototype.handleRecordingCountdown = function (countdown) {
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
        }
        else {
            this.speechSynthesizer.speak(this.localization("recording.voice.finished"));
        }
    };
    RecordingSpeechManager.prototype.stop = function () {
        if (this.subscription === null) {
            throw new RecordingSpeechError("Recording Speech Manager was not started");
        }
        this.subscription.unsubscribe();
        this.subscription = null;
        this.lastSpokenCountdown = null;
        return this;
    };
    return RecordingSpeechManager;
}());
export { RecordingSpeechManager };

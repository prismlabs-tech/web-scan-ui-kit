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
import { getDetectionFeedbackVoiceLocalization } from '../../localization/detection-feedback-localization.js';
import { PositioningStateType, } from './positioning-state-distributor.js';
var PositionSpeechError = /** @class */ (function (_super) {
    __extends(PositionSpeechError, _super);
    function PositionSpeechError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "PositionSpeechError";
        return _this;
    }
    return PositionSpeechError;
}(Error));
export { PositionSpeechError };
var PositionSpeechManager = /** @class */ (function () {
    function PositionSpeechManager(positioningStateDistributor, t) {
        this.speechSynthesizer = new SpeechSynthesizer("en-US");
        this.subscription = null;
        this.positioningStateDistributor = positioningStateDistributor;
        this.localization = t;
        this.positioningStateDistributor = positioningStateDistributor;
    }
    PositionSpeechManager.prototype.start = function () {
        var _this = this;
        if (this.subscription !== null) {
            throw new PositionSpeechError("Position Speech Manager was already started");
        }
        // Subscribe to positioning state changes and trigger speech
        this.subscription =
            this.positioningStateDistributor.positioningState.subscribe(function (state) {
                switch (state.type) {
                    case PositioningStateType.Starting:
                        _this.speechSynthesizer.speak(_this.localization("positioning.voice.prepare"));
                        break;
                    case PositioningStateType.Assisting:
                        if (state.detectionFeedback) {
                            _this.speechSynthesizer.speak(getDetectionFeedbackVoiceLocalization(state.detectionFeedback, _this.localization));
                        }
                        break;
                    case PositioningStateType.VerifyingConsistency:
                        _this.speechSynthesizer.speak(_this.localization("positioning.voice.complete"));
                        break;
                }
            });
        return this;
    };
    PositionSpeechManager.prototype.stop = function () {
        if (this.subscription === null) {
            return;
        }
        this.subscription.unsubscribe();
        this.subscription = null;
        this.speechSynthesizer.cancel();
    };
    return PositionSpeechManager;
}());
export { PositionSpeechManager };

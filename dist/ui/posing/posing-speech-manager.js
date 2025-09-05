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
import { PosingStateType, } from './posing-state-distributor.js';
var PosingSpeechError = /** @class */ (function (_super) {
    __extends(PosingSpeechError, _super);
    function PosingSpeechError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "PosingSpeechError";
        return _this;
    }
    return PosingSpeechError;
}(Error));
export { PosingSpeechError };
var PosingSpeechManager = /** @class */ (function () {
    function PosingSpeechManager(posingStateDistributor, t) {
        this.speechSynthesizer = new SpeechSynthesizer("en-US");
        this.subscription = null;
        this.posingStateDistributor = posingStateDistributor;
        this.localization = t;
    }
    PosingSpeechManager.prototype.start = function () {
        var _this = this;
        if (this.subscription !== null) {
            throw new PosingSpeechError("Posing Speech Manager was already started");
        }
        // Subscribe to positioning state changes and trigger speech
        this.subscription = this.posingStateDistributor.posingState.subscribe(function (state) {
            switch (state.type) {
                case PosingStateType.Starting:
                    _this.speechSynthesizer.speak(_this.localization("posing.voice.prepare"));
                    break;
                case PosingStateType.Assisting:
                    if (state.detectionFeedback) {
                        _this.speechSynthesizer.speak(getDetectionFeedbackVoiceLocalization(state.detectionFeedback, _this.localization));
                    }
                    break;
                case PosingStateType.VerifyingConsistency:
                    break;
            }
        });
        return this;
    };
    PosingSpeechManager.prototype.stop = function () {
        if (this.subscription === null) {
            throw new PosingSpeechError("Posing Speech Manager was not started");
        }
        this.subscription.unsubscribe();
        this.subscription = null;
        return this;
    };
    return PosingSpeechManager;
}());
export { PosingSpeechManager };

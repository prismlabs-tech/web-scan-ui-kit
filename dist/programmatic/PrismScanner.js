var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { applyCustomAssets } from '../assets/assetRegistry.js';
import { prismEventBus } from '../dispatch/EventBus.js';
import { PRISM_LOADED_EVENT, PRISM_SCAN_COMPLETE_EVENT, PRISM_STATE_CHANGE_EVENT, } from '../dispatch/EventNames.js';
import { applyCustomI18n } from '../i18n/applyCustomI18n.js';
import { presentPrismModal } from '../ui/prism-button/prism-button.js';
/**
 * Programmatic scanner with constructor config, no window events.
 * Listeners can be registered immediately after construction.
 *
 * Refer to `PrismConfig` for available configuration options.
 */
var PrismScanner = /** @class */ (function () {
    function PrismScanner(config) {
        this.version = process.env.PRISM_VERSION;
        void this.render(config);
    }
    PrismScanner.prototype.render = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(config === null || config === void 0 ? void 0 : config.localization)) return [3 /*break*/, 2];
                        return [4 /*yield*/, applyCustomI18n(config.localization)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (config === null || config === void 0 ? void 0 : config.assets) {
                            applyCustomAssets(config.assets);
                        }
                        // Emit programmatic loaded event for package consumers
                        prismEventBus.emit(PRISM_LOADED_EVENT, { prism: this });
                        return [2 /*return*/];
                }
            });
        });
    };
    PrismScanner.prototype.unmount = function () {
        // Is this needed? Part of the implementation we are using so it has to be here.
    };
    PrismScanner.prototype.onPrismLoaded = function (handler) {
        return prismEventBus.on(PRISM_LOADED_EVENT, handler);
    };
    PrismScanner.prototype.onPrismStateChange = function (handler) {
        return prismEventBus.on(PRISM_STATE_CHANGE_EVENT, handler);
    };
    PrismScanner.prototype.onPrismScanComplete = function (handler) {
        return prismEventBus.on(PRISM_SCAN_COMPLETE_EVENT, handler);
    };
    /** Programmatically present the Prism modal. */
    PrismScanner.prototype.present = function () {
        presentPrismModal();
    };
    return PrismScanner;
}());
export { PrismScanner };
export default PrismScanner;

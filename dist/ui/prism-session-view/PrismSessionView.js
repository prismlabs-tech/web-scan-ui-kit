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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CaptureSession, PrismSession, PrismSessionState, } from "@prismlabs/web-scan-core";
import { isMobile } from "@tensorflow/tfjs-core/dist/device_util";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dispatchScanComplete } from "../../dispatch";
import '../../i18n/i18n.js';
import CameraFeed from '../camera/CameraFeed.js';
import LevelScreen from '../level/LevelScreen.js';
import Modal, { ModalContentContainer } from '../modal/Modal.js';
import PosingScreen from '../posing/PosingScreen.js';
import PositionScreen from '../positioning/PositionScreen.js';
import ProcessingScreen from '../processing/ProcessingScreen.js';
import RecordingScreen from '../recording/RecordingScreen.js';
function getIsPortraitMobile() {
    return (isMobile(window.navigator) && window.screen.height > window.screen.width);
}
export function PrismSessionView(_a) {
    var _this = this;
    var onClose = _a.onClose;
    var t = useTranslation().t;
    var _b = useState(getIsPortraitMobile()), isPortraitMobile = _b[0], setIsPortraitMobile = _b[1];
    var _c = useState(false), isSessionInitialized = _c[0], setIsSessionInitialized = _c[1];
    var _d = useState(false), isVideoReady = _d[0], setIsVideoReady = _d[1];
    var _e = useState(null), hasCameraPermission = _e[0], setHasCameraPermission = _e[1];
    var _f = useState(), cameraError = _f[0], setCameraError = _f[1];
    var _g = useState(), scanBlob = _g[0], setScanBlob = _g[1];
    var _h = useState(PrismSessionState.IDLE), sessionState = _h[0], setSessionState = _h[1];
    var prismSession = useState(function () {
        var captureSession = new CaptureSession();
        return new PrismSession(captureSession);
    })[0];
    useEffect(function () {
        if (!isVideoReady || !isSessionInitialized) {
            return;
        }
        if (sessionState === PrismSessionState.IDLE) {
            prismSession.continue();
        }
    }, [isVideoReady, isSessionInitialized]);
    useEffect(function () {
        var handleResize = function () { return setIsPortraitMobile(getIsPortraitMobile()); };
        window.addEventListener("resize", handleResize);
        return function () { return window.removeEventListener("resize", handleResize); };
    }, []);
    useEffect(function () {
        var subscription = prismSession.currentSessionState.subscribe(function (state) {
            setSessionState(state);
        });
        // Start the session automatically
        prismSession
            .init(isPortraitMobile)
            .then(function () {
            setIsSessionInitialized(true);
        })
            .catch(function (error) {
            setCameraError(error);
            console.error("Error starting Prism session:", error);
        })
            .finally(function () {
            setHasCameraPermission(prismSession.captureSession.cameraManager.isPermissionGranted);
        });
        var recordingSubscription = prismSession.captureSession.recorder.recording$.subscribe(function (blob) {
            setScanBlob(blob);
        });
        return function () {
            subscription.unsubscribe();
            recordingSubscription.unsubscribe();
            prismSession.cancel();
        };
    }, [prismSession]);
    var handleCancel = function () {
        prismSession.cancel();
        onClose();
    };
    var handleVideoReady = function (video) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, prismSession.captureSession.cameraManager.startVideoPlayback(video)];
                case 1:
                    _a.sent();
                    setIsVideoReady(true);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    setCameraError(error_1);
                    console.error("Camera error:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var endSession = function () {
        prismSession.completeSession();
        setIsSessionInitialized(false);
        setIsVideoReady(false);
        onClose();
        // notify that the scan is complete
        dispatchScanComplete(scanBlob);
    };
    return (_jsx(Modal, { isOpen: true, isMobile: isPortraitMobile, onRequestClose: handleCancel, children: _jsxs(ModalContentContainer, { isMobile: isPortraitMobile, onClose: handleCancel, children: [_jsx("div", { style: {
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                        overflow: "hidden",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        background: "white",
                    }, children: isSessionInitialized && (_jsx(CameraFeed, { cameraManager: prismSession.captureSession.cameraManager, onVideoReady: handleVideoReady })) }), cameraError ? (_jsxs("div", { style: {
                        position: "relative",
                        zIndex: 1,
                        padding: "20px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }, children: [_jsx("h1", { children: "Error accessing the camera feed" }), hasCameraPermission === false ? (_jsx("p", { children: "Please enable camera permissions" })) : (_jsx("p", { children: cameraError.message }))] })) : (_jsxs("div", { style: {
                        position: "relative",
                        zIndex: 1,
                        padding: "20px",
                        height: "100%",
                        maxHeight: "100%" /* Restrict height to fit within modal */,
                        maxWidth: "100%" /* Restrict width to fit within modal */,
                        overflow: "auto" /* Allow scrolling if content exceeds modal size */,
                        boxSizing: "border-box" /* Include padding in dimensions */,
                    }, children: [sessionState === PrismSessionState.LEVELING && (_jsx(LevelScreen, { prismSession: prismSession })), sessionState === PrismSessionState.POSITIONING && (_jsx(PositionScreen, { prismSession: prismSession })), sessionState === PrismSessionState.POSING && (_jsx(PosingScreen, { prismSession: prismSession })), sessionState === PrismSessionState.RECORDING && (_jsx(RecordingScreen, { prismSession: prismSession })), sessionState === PrismSessionState.PROCESSING && (_jsx(ProcessingScreen, { onClose: endSession })), sessionState === PrismSessionState.FINISHED && (_jsxs("div", { children: [_jsx("h3", { children: t("prism.finished.title") }), _jsx("p", { children: t("prism.finished.description") }), _jsx("button", { onClick: endSession, style: {
                                        padding: "10px 20px",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        marginTop: "20px",
                                    }, children: t("prism.finished.viewResults") })] }))] }))] }) }));
}

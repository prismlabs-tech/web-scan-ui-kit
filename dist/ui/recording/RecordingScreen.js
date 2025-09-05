var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Banner, { AlertContainer, BannerType } from "@components/Banner";
import { CenteredComponentContainer } from "@components/CenteredComponentContainer";
import PieProgress from "@components/PieProgress";
import ScreenContainer from "@components/ScreenContainer";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { resolveSvg } from '../../assets/assetRegistry.js';
import { RecordingSpeechManager } from './recording-speech-manager.js';
import { RecordingStateDistributor, RecordingStateType, } from './recording-state-distributor.js';
export var CountdownText = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: white;\n  font-size: 100px;\n  font-family: var(--font-family);\n  text-transform: uppercase;\n  font-weight: bold;\n"], ["\n  color: white;\n  font-size: 100px;\n  font-family: var(--font-family);\n  text-transform: uppercase;\n  font-weight: bold;\n"])));
var PreparationCountdown = function (_a) {
    var countdown = _a.countdown;
    var t = useTranslation().t;
    var countdownText = (function () {
        if (countdown === undefined) {
            return;
        }
        if (countdown > 1) {
            return t("recording.text.ready");
        }
        return t("recording.text.spin");
    })();
    return countdownText && _jsx(CountdownText, { children: countdownText });
};
var RecordingScreen = function (_a) {
    var prismSession = _a.prismSession;
    var t = useTranslation().t;
    var _b = useState(null), recordingState = _b[0], setRecordingState = _b[1];
    var distributorRef = React.useRef(null);
    if (!distributorRef.current) {
        distributorRef.current = new RecordingStateDistributor(prismSession);
    }
    var distributor = distributorRef.current;
    var recordingSpeechManagerRef = React.useRef(null);
    if (!recordingSpeechManagerRef.current) {
        recordingSpeechManagerRef.current = new RecordingSpeechManager(distributor, t);
    }
    var recordingSpeechManager = recordingSpeechManagerRef.current;
    var _c = useState(true), isBannerVisible = _c[0], setBannerVisible = _c[1];
    var _d = useState(false), isRecordingCountdownVisible = _d[0], setRecordingCountdownVisible = _d[1];
    var _e = useState(false), isPreparationCountdownVisible = _e[0], setPreparationCountdownVisible = _e[1];
    var _f = useState(undefined), recordingPieProgress = _f[0], setRecordingPieProgress = _f[1];
    useEffect(function () {
        var subscription = distributor.recordingState.subscribe({
            next: function (state) {
                setRecordingState(state);
            },
            error: function (error) {
                console.error("Error in recording state distributor:", error);
            },
        });
        distributor.start();
        recordingSpeechManager.start();
        return function () {
            recordingSpeechManager.stop(); // Stop speech manager on unmount
            distributor.dispose();
            subscription.unsubscribe(); // Cleanup on unmount
        };
    }, []);
    useEffect(function () {
        var isBannerVisible = (recordingState === null || recordingState === void 0 ? void 0 : recordingState.type) === RecordingStateType.Starting;
        setBannerVisible(isBannerVisible);
        var isPreparationCountdownVisible = (recordingState === null || recordingState === void 0 ? void 0 : recordingState.type) === RecordingStateType.Preparing;
        setPreparationCountdownVisible(isPreparationCountdownVisible);
        var isRecordingCountdownVisible = (recordingState === null || recordingState === void 0 ? void 0 : recordingState.type) === RecordingStateType.Recording;
        setRecordingCountdownVisible(isRecordingCountdownVisible);
    }, [recordingState === null || recordingState === void 0 ? void 0 : recordingState.type]);
    useEffect(function () {
        if ((recordingState === null || recordingState === void 0 ? void 0 : recordingState.type) !== RecordingStateType.Recording) {
            return;
        }
        var remaining = recordingState === null || recordingState === void 0 ? void 0 : recordingState.countdown;
        if (remaining === undefined) {
            setRecordingPieProgress(undefined);
            return;
        }
        var total = 10; // matches RecordingStateDistributor's _recordingTimer(10)
        // The distributor counts down from N..0, we want a 1..0 proportion for the pie
        var pieProgress = Math.max(0, Math.min(1, remaining / total));
        setRecordingPieProgress(pieProgress);
    }, [recordingState === null || recordingState === void 0 ? void 0 : recordingState.countdown]);
    return (_jsxs(ScreenContainer, { children: [isBannerVisible && (_jsx(AlertContainer, { children: _jsx(Banner, { title: t("recording.title"), type: BannerType.CENTER, centerComponent: _jsx("div", { style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }, children: _jsx("img", { src: resolveSvg("spin"), alt: "Spin Icon", style: { width: "150px", height: "150px" } }) }) }) })), isPreparationCountdownVisible && (_jsx(CenteredComponentContainer, { children: _jsx(PreparationCountdown, { countdown: recordingState === null || recordingState === void 0 ? void 0 : recordingState.countdown }) })), isRecordingCountdownVisible && (_jsx(CenteredComponentContainer, { children: _jsx("div", { style: { display: "grid", gap: 20, placeItems: "center" }, children: recordingPieProgress !== undefined && (_jsx(PieProgress, { size: 180, ringWidth: 12, progress: recordingPieProgress })) }) }))] }));
};
export default RecordingScreen;
var templateObject_1;

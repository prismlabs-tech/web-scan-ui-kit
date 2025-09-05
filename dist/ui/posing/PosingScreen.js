import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AnimatedProgressCheckmarkView from "@components/AnimatedProgressCheckmarkView";
import Banner, { AlertContainer, BannerType, TopBannerContainer, } from "@components/Banner";
import { CenteredComponentContainer } from "@components/CenteredComponentContainer";
import ScreenContainer from "@components/ScreenContainer";
import { DetectionFeedbackType, PrismSessionState, } from "@prismlabs/web-scan-core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resolveSvg } from '../../assets/assetRegistry.js';
import { getDetectionFeedbackLocalization } from '../../localization/detection-feedback-localization.js';
import { PoseOverlay } from './pose-overlay.js';
import { PosingSpeechManager } from './posing-speech-manager.js';
import { PosingState, PosingStateDistributor, PosingStateType, } from './posing-state-distributor.js';
import { drawSkeleton } from './skelton-drawing-utils.js';
var BannerFeedback = function (_a) {
    var detectionFeedback = _a.detectionFeedback;
    var getPoseTitle = function (feedback) {
        return getDetectionFeedbackLocalization(feedback);
    };
    var getPosingIcon = function (feedback) {
        switch (feedback.type) {
            case DetectionFeedbackType.Approved:
                return _jsx(AnimatedProgressCheckmarkView, {});
            default:
                return undefined; // Replace with actual icon component
        }
    };
    return (_jsx(TopBannerContainer, { children: _jsx(Banner, { type: BannerType.TOP, title: "", centerComponent: getPosingIcon(detectionFeedback), bottomTitle: getPoseTitle(detectionFeedback) }) }));
};
var PosingScreen = function (_a) {
    var prismSession = _a.prismSession;
    var t = useTranslation().t;
    var _b = useState(PosingState.starting), posingState = _b[0], setPosingState = _b[1];
    var _c = useState(true), isBannerVisible = _c[0], setBannerVisible = _c[1];
    var _d = useState(false), isFeedbackVisible = _d[0], setFeedbackVisible = _d[1];
    var _e = useState(false), isCheckmarkVisible = _e[0], setCheckmarkVisible = _e[1];
    var distributorRef = React.useRef(null);
    if (!distributorRef.current) {
        distributorRef.current = new PosingStateDistributor(prismSession.captureSession.positionReadinessDistributor, prismSession.captureSession.poseReadinessDistributor);
    }
    var distributor = distributorRef.current;
    var posingSpeechManagerRef = React.useRef(null);
    if (!posingSpeechManagerRef.current) {
        posingSpeechManagerRef.current = new PosingSpeechManager(distributor, t);
    }
    var posingSpeechManager = posingSpeechManagerRef.current;
    useEffect(function () {
        var subscription = distributor.posingState.subscribe({
            next: function (state) {
                setPosingState(state);
            },
            error: function (error) {
                console.error("Error in posing state distributor:", error);
            },
        });
        distributor.start(); // start the state distributor
        posingSpeechManager.start();
        return function () {
            posingSpeechManager.stop(); // Stop speech manager on unmount
            distributor.dispose();
            subscription.unsubscribe(); // Cleanup on unmount
        };
    }, []);
    useEffect(function () {
        var isBannerVisible = posingState.type === PosingStateType.Starting;
        setBannerVisible(isBannerVisible);
        var isFeedbackVisible = posingState.type === PosingStateType.Assisting ||
            posingState.type === PosingStateType.VerifyingConsistency;
        setFeedbackVisible(isFeedbackVisible);
        var isCheckmarkVisible = posingState.type === PosingStateType.VerifyingConsistency;
        setCheckmarkVisible(isCheckmarkVisible);
    }, [posingState.type]);
    var handleAnimationFinished = function () {
        prismSession.continueFrom(PrismSessionState.POSING);
    };
    return (_jsxs(ScreenContainer, { children: [_jsx(PoseOverlay, { posingState: posingState, prismSession: prismSession, drawSkeleton: drawSkeleton }), isBannerVisible && (_jsx(AlertContainer, { children: _jsx(Banner, { title: t("posing.title"), type: BannerType.CENTER, centerComponent: _jsx("div", { style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }, children: _jsx("img", { src: resolveSvg("body_scan_large"), alt: "Pose Position", style: { width: "150px", height: "150px" } }) }) }) })), isFeedbackVisible && posingState.detectionFeedback && (_jsx(BannerFeedback, { detectionFeedback: posingState.detectionFeedback })), isCheckmarkVisible && (_jsx(CenteredComponentContainer, { children: _jsx(AnimatedProgressCheckmarkView, { onAnimationComplete: handleAnimationFinished, duration: 2000 }) }))] }));
};
export default PosingScreen;

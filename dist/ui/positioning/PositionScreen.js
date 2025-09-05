import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AnimatedProgressCheckmarkView from "@components/AnimatedProgressCheckmarkView";
import Banner, { AlertContainer, BannerType, TopBannerContainer, } from "@components/Banner";
import CameraViewfinder from "@components/CameraViewfinder";
import { CenteredComponentContainer } from "@components/CenteredComponentContainer";
import ScreenContainer from "@components/ScreenContainer";
import { DetectionFailure, DetectionFeedbackType, PrismSessionState, } from "@prismlabs/web-scan-core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resolveSvg } from '../../assets/assetRegistry.js';
import { getDetectionFeedbackLocalization } from '../../localization/detection-feedback-localization.js';
import { YellowIcon, YellowIconType } from "../components";
import CameraOutline, { OutlineState } from '../components/CameraOutline.js';
import ErrorView from '../components/ErrorView.js';
import { PositionSpeechManager } from './position-speech-manager.js';
import { PositioningState, PositioningStateDistributor, PositioningStateType, } from './positioning-state-distributor.js';
var BannerFeedback = function (_a) {
    var detectionFeedback = _a.detectionFeedback;
    var getPositionTitle = function (feedback) {
        return getDetectionFeedbackLocalization(feedback);
    };
    var getPositionIcon = function (feedback) {
        switch (feedback.type) {
            case DetectionFeedbackType.EmptyFrame:
            case DetectionFeedbackType.IncompleteData:
            case DetectionFeedbackType.MultiplePeople:
                return _jsx(ErrorView, {});
            case DetectionFeedbackType.Failed:
                switch (feedback.detectionFailure) {
                    case DetectionFailure.TOO_FAR:
                        return _jsx(YellowIcon, { icon: YellowIconType.ArrowDown });
                    case DetectionFailure.TOO_CLOSE:
                        return _jsx(YellowIcon, { icon: YellowIconType.ArrowUp });
                    case DetectionFailure.TOO_FAR_LEFT:
                        return _jsx(YellowIcon, { icon: YellowIconType.ArrowRight });
                    case DetectionFailure.TOO_FAR_RIGHT:
                        return _jsx(YellowIcon, { icon: YellowIconType.ArrowLeft });
                    case DetectionFailure.BACKWARD:
                        return _jsx(ErrorView, {});
                    case DetectionFailure.CAMERA_TOO_HIGH:
                    case DetectionFailure.EMPTY_SPACE_TOP:
                        return _jsx(YellowIcon, { icon: YellowIconType.MoveCameraUp });
                    case DetectionFailure.CAMERA_TOO_LOW:
                    case DetectionFailure.EMPTY_SPACE_BOTTOM:
                        return _jsx(YellowIcon, { icon: YellowIconType.MoveCameraDown });
                    default:
                        return _jsx(ErrorView, {});
                }
            case DetectionFeedbackType.Approved:
                return _jsx(AnimatedProgressCheckmarkView, {});
            default:
                return undefined; // Replace with actual icon component
        }
    };
    return (_jsx(TopBannerContainer, { children: _jsx(Banner, { type: BannerType.TOP, title: "", centerComponent: getPositionIcon(detectionFeedback), bottomTitle: getPositionTitle(detectionFeedback) }) }));
};
var PositionScreen = function (_a) {
    var prismSession = _a.prismSession;
    var t = useTranslation().t;
    var distributorRef = React.useRef(null);
    if (!distributorRef.current) {
        distributorRef.current = new PositioningStateDistributor(prismSession.captureSession.positionReadinessDistributor);
    }
    var distributor = distributorRef.current;
    var positionSpeechManagerRef = React.useRef(null);
    if (!positionSpeechManagerRef.current) {
        positionSpeechManagerRef.current = new PositionSpeechManager(distributor, t);
    }
    var positionSpeechManager = positionSpeechManagerRef.current;
    var _b = useState(PositioningState.starting), positioningState = _b[0], setPositioningState = _b[1];
    var _c = useState(true), isBannerVisible = _c[0], setBannerVisible = _c[1];
    var _d = useState(false), isFeedbackVisible = _d[0], setFeedbackVisible = _d[1];
    var _e = useState(false), isCheckmarkVisible = _e[0], setCheckmarkVisible = _e[1];
    // Determine outline state based on detection feedback
    var getOutlineState = function () {
        if (!positioningState.detectionFeedback) {
            return OutlineState.Clear;
        }
        var feedbackType = positioningState.detectionFeedback.type;
        // Clear state for no person detected
        if (feedbackType === DetectionFeedbackType.EmptyFrame ||
            feedbackType === DetectionFeedbackType.IncompleteData) {
            return OutlineState.Error;
        }
        // Success state for approved
        if (feedbackType === DetectionFeedbackType.Approved) {
            return OutlineState.Success;
        }
        // Error state for all other cases (MultiplePeople, Failed)
        return OutlineState.Error;
    };
    useEffect(function () {
        var subscription = distributor.positioningState.subscribe({
            next: function (state) {
                setPositioningState(state);
            },
            error: function (error) {
                console.error("Error in positioning state distributor:", error);
            },
        });
        distributor.start(); // start the state distributor
        positionSpeechManager.start(); // Start the speech manager
        return function () {
            positionSpeechManager.stop(); // Stop the speech manager on unmount
            distributor.dispose();
            subscription.unsubscribe(); // Cleanup on unmount
        };
    }, []);
    useEffect(function () {
        var isBannerVisible = positioningState.type === PositioningStateType.Starting;
        setBannerVisible(isBannerVisible);
        var isFeedbackVisible = positioningState.type === PositioningStateType.Assisting ||
            positioningState.type === PositioningStateType.VerifyingConsistency;
        setFeedbackVisible(isFeedbackVisible);
        var isCheckmarkVisible = positioningState.type === PositioningStateType.VerifyingConsistency;
        setCheckmarkVisible(isCheckmarkVisible);
    }, [positioningState.type]);
    var handleAnimationFinished = function () {
        prismSession.continueFrom(PrismSessionState.POSITIONING);
    };
    return (_jsxs(ScreenContainer, { children: [_jsx(CameraOutline, { "$outlineState": getOutlineState() }), _jsx(CameraViewfinder, { size: 250 }), isBannerVisible && (_jsx(AlertContainer, { children: _jsx(Banner, { title: t("positioning.title"), type: BannerType.CENTER, centerComponent: _jsx("div", { style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }, children: _jsx("img", { src: resolveSvg("body_scan_large"), alt: "User Position", style: { width: "150px", height: "150px" } }) }) }) })), isFeedbackVisible && positioningState.detectionFeedback && (_jsx(BannerFeedback, { detectionFeedback: positioningState.detectionFeedback })), isCheckmarkVisible && (_jsx(CenteredComponentContainer, { children: _jsx(AnimatedProgressCheckmarkView, { onAnimationComplete: handleAnimationFinished, duration: 2500 }) }))] }));
};
export default PositionScreen;

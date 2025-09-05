var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Banner, { AlertContainer, BannerType, TopBannerContainer, } from "@components/Banner";
import { Level, PrismSessionState, } from "@prismlabs/web-scan-core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { resolveSvg } from '../../assets/assetRegistry.js';
import { YellowIcon, YellowIconType } from "../components";
import DarkbackgroundBlur from '../components/DarkBackgroundBlur.js';
import ScreenContainer from '../components/ScreenContainer.js';
import LevelIndicator from './LevelIndicator.js';
var LevelIndicatorContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 1; /* Above the blurred background */\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: auto;\n"], ["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 1; /* Above the blurred background */\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: auto;\n"])));
var LevelScreen = function (_a) {
    var prismSession = _a.prismSession;
    var t = useTranslation().t;
    var _b = useState(true), isBannerVisible = _b[0], setIsBannerVisible = _b[1];
    var _c = useState(null), levelValue = _c[0], setLevelValue = _c[1];
    var handleDismissBanner = function () {
        // start listening now, since it needs to be in response to a user interaction
        prismSession.captureSession.levelReadinessDistributor.startListening();
        setIsBannerVisible(false);
    };
    var handleLevelChange = function (level) {
        setLevelValue(level);
    };
    var handleLevelReady = function () {
        prismSession.continueFrom(PrismSessionState.LEVELING);
        prismSession.captureSession.levelReadinessDistributor.stopListening();
    };
    var getLevelTitle = function (level) {
        switch (level) {
            case Level.LEVEL:
                return t("leveling.level.level");
            case Level.BACKWARDS:
                return t("leveling.level.backwards");
            case Level.FORWARDS:
                return t("leveling.level.forwards");
            default:
                return t("leveling.level.unknownLevel");
        }
    };
    var getLevelIcon = function (level) {
        switch (level) {
            case Level.BACKWARDS:
                return _jsx(YellowIcon, { icon: YellowIconType.ArrowDown });
            case Level.FORWARDS:
                return _jsx(YellowIcon, { icon: YellowIconType.ArrowUp }); // Replace with actual icon component
            default:
                return undefined; // Replace with actual icon component
        }
    };
    return (_jsxs(ScreenContainer, { children: [_jsx(DarkbackgroundBlur, {}), _jsx(LevelIndicatorContainer, { children: _jsx(LevelIndicator, { motionDistributor: prismSession.captureSession.levelReadinessDistributor, onLevelChange: handleLevelChange, onReady: handleLevelReady }) }), isBannerVisible && (_jsx(AlertContainer, { children: _jsx(Banner, { title: t("leveling.title"), bottomTitle: t("leveling.description"), buttonText: t("leveling.button"), centerComponent: _jsx("div", { style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }, children: _jsx("img", { src: resolveSvg("phone_position"), alt: "Phone Position", style: { width: "150px", height: "150px" } }) }), onButtonClick: handleDismissBanner }) })), !isBannerVisible && levelValue && (_jsx(TopBannerContainer, { children: _jsx(Banner, { type: BannerType.TOP, title: levelValue === Level.LEVEL ? getLevelTitle(levelValue) : "", centerComponent: getLevelIcon(levelValue), bottomTitle: levelValue !== Level.LEVEL ? getLevelTitle(levelValue) : undefined }) }))] }));
};
export default LevelScreen;
var templateObject_1;

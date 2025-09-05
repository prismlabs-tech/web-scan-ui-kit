var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Level, validateLevelReadiness, } from "@prismlabs/web-scan-core";
import { useEffect, useState } from "react";
import styled from "styled-components";
import AnimatedProgressCheckmarkView from '../components/AnimatedProgressCheckmarkView.js';
import { LevelBar } from './LevelBar.js';
import { LevelLine } from './LevelLine.js';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  height: 400px;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  overflow: hidden;\n"], ["\n  position: relative;\n  height: 400px;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  overflow: hidden;\n"])));
var BarWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n  width: 100%;\n  height: 100%;\n"], ["\n  position: relative;\n  width: 100%;\n  height: 100%;\n"])));
var CenteredLevelLine = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  left: 0;\n  width: 100%;\n  transform: translateY(-50%);\n  z-index: 2;\n  pointer-events: none;\n"], ["\n  position: absolute;\n  top: 50%;\n  left: 0;\n  width: 100%;\n  transform: translateY(-50%);\n  z-index: 2;\n  pointer-events: none;\n"])));
var LEVEL_BAR_HEIGHT = 54; // pixels - height of the LevelBar component
var MAX_ACCEPTABLE_TILT = 3; // degrees - maximum tilt (either way) before we consider it not level
var MAX_ROTATION = 100; // pixels - maximum rotation in either direction for the level bar
var SCALE_FACTOR = LEVEL_BAR_HEIGHT / (MAX_ACCEPTABLE_TILT * 2); // Scale factor based on size of the level bar divided into degrees (tilt can be positive or negative)
var LevelIndicator = function (_a) {
    var motionDistributor = _a.motionDistributor, onLevelChange = _a.onLevelChange, onReady = _a.onReady;
    var _b = useState(null), levelReadiness = _b[0], setLevelReadiness = _b[1];
    var _c = useState(0), rotationPixels = _c[0], setRotationPixels = _c[1];
    // Clamp pixel value
    var clampRotation = function (value) {
        return Math.max(Math.min(value, MAX_ROTATION), -MAX_ROTATION);
    };
    // Scale the value based on the level bar height
    var scaleRotationToPixels = function (value) {
        return value * SCALE_FACTOR;
    };
    // Start listening for orientation changes
    var startMotionTracking = function () {
        // Add our listener
        return motionDistributor.windowedAverageOrientationData.subscribe(function (data) {
            if (!data) {
                return;
            }
            // Validate the level using our new validator
            var readiness = validateLevelReadiness(data);
            setLevelReadiness(readiness);
            var valueInPixels = scaleRotationToPixels(readiness.verticalRotation);
            var adjustedRotation = readiness.level === Level.LEVEL ? 0 : clampRotation(valueInPixels); // snap to 0 if level
            setRotationPixels(adjustedRotation);
        });
    };
    useEffect(function () {
        var subscription = startMotionTracking();
        // Cleanup when component unmounts
        return function () {
            subscription.unsubscribe();
            motionDistributor.stopListening();
        };
    }, []);
    useEffect(function () {
        if ((levelReadiness === null || levelReadiness === void 0 ? void 0 : levelReadiness.level) && onLevelChange) {
            onLevelChange(levelReadiness === null || levelReadiness === void 0 ? void 0 : levelReadiness.level); // Trigger callback
        }
    }, [levelReadiness, onLevelChange]);
    var handleAnimationFinished = function () {
        if (onReady) {
            onReady();
        }
    };
    if (!levelReadiness) {
        return _jsx("div", {});
    }
    return (_jsx(Container, { children: _jsxs(BarWrapper, { children: [_jsx(LevelBar, { state: levelReadiness.level, rotationPx: rotationPixels }), levelReadiness.level === Level.LEVEL && (_jsx("div", { style: {
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 3,
                    }, children: _jsx(AnimatedProgressCheckmarkView, { onAnimationComplete: handleAnimationFinished, duration: 1500 }) })), _jsx(CenteredLevelLine, { children: _jsx(LevelLine, {}) })] }) }));
};
export default LevelIndicator;
var templateObject_1, templateObject_2, templateObject_3;

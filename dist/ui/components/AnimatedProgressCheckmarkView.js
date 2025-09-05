var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
var Circle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: 5%;\n  left: 5%;\n  transform: translate(-50%, -50%);\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  background-color: var(--success-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1;\n"], ["\n  position: absolute;\n  top: 5%;\n  left: 5%;\n  transform: translate(-50%, -50%);\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  background-color: var(--success-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1;\n"])));
var PieShape = styled.div.attrs(function (_a) {
    var $progress = _a.$progress;
    return ({
        style: {
            background: "conic-gradient(white ".concat($progress * 360, "deg, transparent ").concat($progress * 360, "deg)"),
        },
    });
})(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  width: 90px;\n  height: 90px;\n  border-radius: 50%;\n  z-index: 0; /* Place pie chart at the back */\n"], ["\n  position: absolute;\n  width: 90px;\n  height: 90px;\n  border-radius: 50%;\n  z-index: 0; /* Place pie chart at the back */\n"])));
var Checkmark = styled.svg(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 55px;\n  height: 55px;\n  stroke: white;\n  stroke-width: 3;\n  fill: none;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-dasharray: 40; /* Total length of the path */\n  stroke-dashoffset: 40; /* Initially hide the stroke */\n  animation: draw 0.5s ease-out forwards 0.5s; /* Start immediately after the component mounts */\n\n  @keyframes draw {\n    to {\n      stroke-dashoffset: 0; /* Fully reveal the stroke */\n    }\n  }\n"], ["\n  width: 55px;\n  height: 55px;\n  stroke: white;\n  stroke-width: 3;\n  fill: none;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-dasharray: 40; /* Total length of the path */\n  stroke-dashoffset: 40; /* Initially hide the stroke */\n  animation: draw 0.5s ease-out forwards 0.5s; /* Start immediately after the component mounts */\n\n  @keyframes draw {\n    to {\n      stroke-dashoffset: 0; /* Fully reveal the stroke */\n    }\n  }\n"])));
var AnimatedProgressCheckmarkView = function (_a) {
    var _b = _a.duration, duration = _b === void 0 ? 2 * 1000 : _b, onAnimationComplete = _a.onAnimationComplete;
    var _c = useState(0), progress = _c[0], setProgress = _c[1];
    useEffect(function () {
        var interval = 50; // Update every 50ms
        var increment = (100 / duration) * interval;
        var timer = setInterval(function () {
            setProgress(function (prev) {
                var newProgress = prev + increment;
                if (newProgress >= 100) {
                    clearInterval(timer);
                    onAnimationComplete && onAnimationComplete();
                    return 100;
                }
                return newProgress;
            });
        }, interval);
        return function () { return clearInterval(timer); };
    }, []);
    return (_jsxs("div", { style: { position: 'relative', width: '95px', height: '95px' }, children: [_jsx(PieShape, { "$progress": progress / 100 }), _jsx(Circle, { style: { transform: "scale(1.0)" }, children: _jsx(Checkmark, { viewBox: "0 0 24 24", children: _jsx("path", { d: "M5 12l5 5L19 7" }) }) })] }));
};
export default AnimatedProgressCheckmarkView;
var templateObject_1, templateObject_2, templateObject_3;

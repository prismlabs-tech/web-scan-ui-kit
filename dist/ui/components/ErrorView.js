var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
var Circle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: -10%;\n  left: -10%;\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  background-color: var(--error-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1;\n"], ["\n  position: absolute;\n  top: -10%;\n  left: -10%;\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  background-color: var(--error-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1;\n"])));
var Cross = styled.svg(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 55px;\n  height: 55px;\n  stroke: white;\n  stroke-width: 3;\n  fill: none;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n\n  line {\n    stroke-dasharray: 30;\n    stroke-dashoffset: 30;\n    animation: draw 0.4s ease-out forwards;\n  }\n\n  line:last-child {\n    animation-delay: 0.15s; /* Stagger second stroke */\n  }\n\n  @keyframes draw {\n    to {\n      stroke-dashoffset: 0;\n    }\n  }\n"], ["\n  width: 55px;\n  height: 55px;\n  stroke: white;\n  stroke-width: 3;\n  fill: none;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n\n  line {\n    stroke-dasharray: 30;\n    stroke-dashoffset: 30;\n    animation: draw 0.4s ease-out forwards;\n  }\n\n  line:last-child {\n    animation-delay: 0.15s; /* Stagger second stroke */\n  }\n\n  @keyframes draw {\n    to {\n      stroke-dashoffset: 0;\n    }\n  }\n"])));
var ErrorView = function () {
    return (_jsx("div", { style: { position: 'relative', width: '65px', height: '65px' }, children: _jsx(Circle, { children: _jsxs(Cross, { viewBox: "0 0 24 24", children: [_jsx("line", { x1: "7", y1: "7", x2: "17", y2: "17" }), _jsx("line", { x1: "17", y1: "7", x2: "7", y2: "17" })] }) }) }));
};
export default ErrorView;
var templateObject_1, templateObject_2;

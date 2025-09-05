var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Level } from '@prismlabs/web-scan-core';
import styled from 'styled-components';
var Container = styled.div.attrs(function (_a) {
    var $height = _a.$height, $translateY = _a.$translateY;
    return ({
        style: {
            height: "".concat($height, "px"),
            transform: "translateY(".concat($translateY - $height / 2, "px)"),
        },
    });
})(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  top: 200px;\n  width: 100%;\n  max-width: 700px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);\n"], ["\n  position: relative;\n  top: 200px;\n  width: 100%;\n  max-width: 700px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);\n"])));
var Background = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: ", ";\n  border-radius: 8px;\n  box-sizing: border-box;\n  z-index: 1;\n  transition:\n    background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n    border 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n"], ["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: ", ";\n  border-radius: 8px;\n  box-sizing: border-box;\n  z-index: 1;\n  transition:\n    background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1),\n    border 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n"])), function (props) { return (props.$isLevel ? 'var(--success-color)' : 'var(--error-color)'); });
var CenteredLabel = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 2;\n  color: #fff;\n  font-weight: var(--body-font-weight);\n  font-size: var(--body-font-size);\n  font-family: var(--font-family);\n  line-height: var(--body-line-height);\n  letter-spacing: 1px;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);\n  pointer-events: none;\n"], ["\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 2;\n  color: #fff;\n  font-weight: var(--body-font-weight);\n  font-size: var(--body-font-size);\n  font-family: var(--font-family);\n  line-height: var(--body-line-height);\n  letter-spacing: 1px;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);\n  pointer-events: none;\n"])));
export var LevelBar = function (_a) {
    var state = _a.state, _b = _a.rotationPx, rotationPx = _b === void 0 ? 0 : _b;
    var label = state === Level.LEVEL ? '' : 'NOT LEVEL';
    return (_jsxs(Container, { "$height": 54, "$translateY": rotationPx, children: [_jsx(Background, { "$isLevel": state === Level.LEVEL }), _jsx(CenteredLabel, { children: label })] }));
};
export default LevelBar;
var templateObject_1, templateObject_2, templateObject_3;

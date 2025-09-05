var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
var StyledButton = styled.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px 24px;\n  background-color: var(--primary-color);\n  color: var(--text-color);\n  font-family: var(--font-family);\n  font-size: var(--body-font-size);\n  font-weight: bold;\n  border: none;\n  border-radius: var(--primary-button-corner-radius);\n  cursor: pointer;\n  box-shadow: 0px 4px 8px var(--shadow-color);\n  transition:\n    transform 0.2s ease,\n    box-shadow 0.2s ease;\n  width: 100%; /* Fluid width to match the alert */\n  height: 50px; /* Allow height to adjust based on content */\n\n  &:active {\n    transform: scale(0.95); /* Scale down on click */\n    box-shadow: 0px 4px 8px var(--shadow-color);\n  }\n"], ["\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px 24px;\n  background-color: var(--primary-color);\n  color: var(--text-color);\n  font-family: var(--font-family);\n  font-size: var(--body-font-size);\n  font-weight: bold;\n  border: none;\n  border-radius: var(--primary-button-corner-radius);\n  cursor: pointer;\n  box-shadow: 0px 4px 8px var(--shadow-color);\n  transition:\n    transform 0.2s ease,\n    box-shadow 0.2s ease;\n  width: 100%; /* Fluid width to match the alert */\n  height: 50px; /* Allow height to adjust based on content */\n\n  &:active {\n    transform: scale(0.95); /* Scale down on click */\n    box-shadow: 0px 4px 8px var(--shadow-color);\n  }\n"])));
var ActionButton = function (_a) {
    var onClick = _a.onClick, children = _a.children;
    return _jsx(StyledButton, { onClick: onClick, children: children });
};
export default ActionButton;
var templateObject_1;

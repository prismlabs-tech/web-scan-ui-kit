var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { styled } from 'styled-components';
var DarkbackgroundBlur = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: fixed;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 0;\n  backdrop-filter: blur(16px);\n  background: var(--overlay-color);\n  pointer-events: none;\n"], ["\n  position: fixed;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 0;\n  backdrop-filter: blur(16px);\n  background: var(--overlay-color);\n  pointer-events: none;\n"])));
export default DarkbackgroundBlur;
var templateObject_1;

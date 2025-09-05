var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { styled } from 'styled-components';
export var OutlineState;
(function (OutlineState) {
    OutlineState["Clear"] = "clear";
    OutlineState["Error"] = "error";
    OutlineState["Success"] = "success";
})(OutlineState || (OutlineState = {}));
var CameraOutline = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: -20px;\n  left: -20px;\n  right: -20px;\n  bottom: -20px;\n  border: 20px solid\n    ", ";\n  pointer-events: none;\n  z-index: 100;\n  border-radius: 8px;\n  box-shadow: ", ";\n  transition:\n    border-color 0.3s ease,\n    box-shadow 0.3s ease;\n"], ["\n  position: absolute;\n  top: -20px;\n  left: -20px;\n  right: -20px;\n  bottom: -20px;\n  border: 20px solid\n    ", ";\n  pointer-events: none;\n  z-index: 100;\n  border-radius: 8px;\n  box-shadow: ", ";\n  transition:\n    border-color 0.3s ease,\n    box-shadow 0.3s ease;\n"])), function (_a) {
    var $outlineState = _a.$outlineState;
    switch ($outlineState) {
        case OutlineState.Clear:
            return 'var(--overlay-color)';
        case OutlineState.Error:
            return 'var(--error-color)';
        case OutlineState.Success:
            return 'var(--success-color)';
        default:
            return 'transparent';
    }
}, function (_a) {
    var $outlineState = _a.$outlineState;
    switch ($outlineState) {
        case OutlineState.Clear:
            return 'none';
        case OutlineState.Error:
            return 'inset 0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 20px var(--error-color)';
        case OutlineState.Success:
            return 'inset 0 0 0 2px rgba(255, 255, 255, 0.1), 0 0 20px var(--success-color)';
        default:
            return 'none';
    }
});
export default CameraOutline;
var templateObject_1;

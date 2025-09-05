var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import styled from 'styled-components';
// Primary overlay container spans the full parent so lines can reach edges
var Overlay = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  z-index: 1;\n  opacity: 0.8;\n"], ["\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  z-index: 1;\n  opacity: 0.8;\n"])));
var Line = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  background: ", ";\n  ", "\n"], ["\n  position: absolute;\n  background: ", ";\n  ", "\n"])), function (p) { return p.$color; }, function (p) {
    return p.$orientation === 'horizontal'
        ? "top: 50%; left: 0; transform: translateY(-50%); height: ".concat(p.$thickness, "px; width: 100%;")
        : "left: 50%; top: 0; transform: translateX(-50%); width: ".concat(p.$thickness, "px; height: 100%;");
});
var CenterCircle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: ", "px;\n  height: ", "px;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  background: ", ";\n"], ["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: ", "px;\n  height: ", "px;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  background: ", ";\n"])), function (p) { return p.$diameter; }, function (p) { return p.$diameter; }, function (p) { return p.$color; });
var CornerSvg = styled.svg(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: ", "px;\n  height: ", "px;\n  transform: translate(-50%, -50%);\n  overflow: visible;\n"], ["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: ", "px;\n  height: ", "px;\n  transform: translate(-50%, -50%);\n  overflow: visible;\n"])), function (p) { return p.$size; }, function (p) { return p.$size; });
var CornerPath = styled.path(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  stroke: ", ";\n  stroke-width: ", "px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  fill: none;\n"], ["\n  stroke: ", ";\n  stroke-width: ", "px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  fill: none;\n"])), function (p) { return p.$color; }, function (p) { return p.$strokeWidth; });
var CameraViewfinder = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 125 : _b, _c = _a.centerDiameter, centerDiameter = _c === void 0 ? 75 : _c, _d = _a.cornerLength, cornerLength = _d === void 0 ? 35 : _d, _e = _a.strokeWidth, strokeWidth = _e === void 0 ? 8 : _e, _f = _a.color, color = _f === void 0 ? 'var(--prism-viewfinder-color, rgba(255,255,255,0.8))' : _f, className = _a.className;
    var pathD = useMemo(function () {
        var s = size;
        var L = cornerLength;
        // Replicates SwiftUI path commands
        return [
            // Top-left
            "M0 0 L0 ".concat(L),
            "M0 0 L".concat(L, " 0"),
            // Top-right
            "M".concat(s, " 0 L").concat(s, " ").concat(L),
            "M".concat(s - L, " 0 L").concat(s, " 0"),
            // Bottom-left
            "M0 ".concat(s, " L0 ").concat(s - L),
            "M0 ".concat(s, " L").concat(L, " ").concat(s),
            // Bottom-right
            "M".concat(s, " ").concat(s, " L").concat(s, " ").concat(s - L),
            "M".concat(s - L, " ").concat(s, " L").concat(s, " ").concat(s),
        ].join(' ');
    }, [size, cornerLength]);
    return (_jsxs(Overlay, { className: className, children: [_jsx(Line, { "$orientation": "horizontal", "$thickness": strokeWidth, "$color": color }), _jsx(Line, { "$orientation": "vertical", "$thickness": strokeWidth, "$color": color }), _jsx(CenterCircle, { "$diameter": centerDiameter, "$color": color }), _jsx(CornerSvg, { "$size": size, viewBox: "0 0 ".concat(size, " ").concat(size), children: _jsx(CornerPath, { "$strokeWidth": strokeWidth, "$color": color, d: pathD }) })] }));
};
export default CameraViewfinder;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
var Wrapper = styled.div.withConfig({
    shouldForwardProp: function (prop) { return prop !== 'size'; },
})(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  width: ", "px;\n  height: ", "px;\n  display: inline-block;\n"], ["\n  position: relative;\n  width: ", "px;\n  height: ", "px;\n  display: inline-block;\n"])), function (p) { return p.size; }, function (p) { return p.size; });
var Pie = styled.div.withConfig({
    shouldForwardProp: function (prop) {
        return !['ring', 'fill', 'track', 'progress', 'startAngle'].includes(prop);
    },
})(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  border: ", "px solid ", ";\n  background: ", ";\n"], ["\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  border: ", "px solid ", ";\n  background: ", ";\n"])), function (p) { return p.ring; }, function (p) { return p.track; }, function (p) {
    return "conic-gradient(from ".concat(p.startAngle, "deg, ").concat(p.track, " ").concat((1 - Math.max(0, Math.min(1, p.progress))) * 360, "deg, ").concat(p.fill, " 0deg)");
});
var PieProgress = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 180 : _b, _c = _a.ringWidth, ringWidth = _c === void 0 ? 10 : _c, progress = _a.progress, _d = _a.fillColor, fillColor = _d === void 0 ? 'var(--primary-color)' : _d, _e = _a.trackColor, trackColor = _e === void 0 ? 'var(--background-color)' : _e, _f = _a.startAngleDeg, startAngleDeg = _f === void 0 ? 0 : _f, className = _a.className;
    return (_jsx(Wrapper, { size: size, className: className, children: _jsx(Pie, { ring: ringWidth, fill: fillColor, track: trackColor, progress: progress, startAngle: startAngleDeg }) }));
};
export default PieProgress;
var templateObject_1, templateObject_2;

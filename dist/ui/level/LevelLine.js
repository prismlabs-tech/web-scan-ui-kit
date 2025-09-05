var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  padding: 16px;\n"], ["\n  display: flex;\n  align-items: center;\n  padding: 16px;\n"])));
var Square = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 10px;\n  height: 10px;\n  background-color: black;\n  transform: rotate(45deg);\n"], ["\n  width: 10px;\n  height: 10px;\n  background-color: black;\n  transform: rotate(45deg);\n"])));
var DashedLine = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  flex: 1;\n  height: 3px;\n  margin: 0 16px;\n  margin-top: 4px;\n  border-top: 2px dashed black;\n"], ["\n  flex: 1;\n  height: 3px;\n  margin: 0 16px;\n  margin-top: 4px;\n  border-top: 2px dashed black;\n"])));
export var LevelLine = function () {
    return (_jsxs(Container, { children: [_jsx(Square, {}), _jsx(DashedLine, {}), _jsx(Square, {})] }));
};
export default LevelLine;
var templateObject_1, templateObject_2, templateObject_3;

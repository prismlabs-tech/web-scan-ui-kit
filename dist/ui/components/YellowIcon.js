var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import { resolveSvg } from '../../assets/assetRegistry.js';
export var YellowIconType;
(function (YellowIconType) {
    YellowIconType["Alert"] = "alert";
    YellowIconType["ArrowDown"] = "arrow_down";
    YellowIconType["ArrowLeft"] = "arrow_left";
    YellowIconType["ArrowRight"] = "arrow_right";
    YellowIconType["ArrowUp"] = "arrow_up";
    YellowIconType["BodyOverlay"] = "body_overlay";
    YellowIconType["BodyScan"] = "body_scan";
    YellowIconType["Book"] = "book";
    YellowIconType["Check"] = "check";
    YellowIconType["ChevronDown"] = "chevron_down";
    YellowIconType["ChevronLeft"] = "chevron_left";
    YellowIconType["ChevronRight"] = "chevron_right";
    YellowIconType["ChevronUp"] = "chevron_up";
    YellowIconType["Close"] = "close";
    YellowIconType["Help"] = "help";
    YellowIconType["Info"] = "info";
    YellowIconType["Loading"] = "loading";
    YellowIconType["Minus"] = "minus";
    YellowIconType["MoveCameraDown"] = "move_camera_down";
    YellowIconType["MoveCameraUp"] = "move_camera_up";
    YellowIconType["Phone"] = "phone";
    YellowIconType["Play"] = "play";
    YellowIconType["Plus"] = "plus";
    YellowIconType["Rotate"] = "rotate";
    YellowIconType["Ruler"] = "ruler";
    YellowIconType["Spin"] = "spin";
    YellowIconType["User"] = "user";
    YellowIconType["VolumeHigh"] = "volume_high";
    YellowIconType["VolumeLow"] = "volume_low";
    YellowIconType["VolumeMedium"] = "volume_medium";
    YellowIconType["VolumeMute"] = "volume_mute";
})(YellowIconType || (YellowIconType = {}));
var IconWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 82px;\n  height: 82px;\n  background-color: var(--icon-background-color); /* Yellow background */\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"], ["\n  width: 82px;\n  height: 82px;\n  background-color: var(--icon-background-color); /* Yellow background */\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"])));
var IconImage = styled.img(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 40px;\n  height: 40px;\n"], ["\n  width: 40px;\n  height: 40px;\n"])));
export var YellowIcon = function (_a) {
    var icon = _a.icon;
    return (_jsx(IconWrapper, { children: _jsx(IconImage, { src: resolveSvg(icon), alt: icon }) }));
};
var templateObject_1, templateObject_2;

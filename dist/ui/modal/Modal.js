var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import { PRISM_CSS_CLASSNAME } from '../../constants.js';
import './Modal.css';
function CloseButton(_a) {
    var onClick = _a.onClick;
    return (_jsx("button", { className: "prism-modal-close", onClick: onClick, "aria-label": "Close modal", children: _jsx("div", { className: "prism-modal-close-icon" }) }));
}
export default function Modal(_a) {
    var isMobile = _a.isMobile, onRequestClose = _a.onRequestClose, props = __rest(_a, ["isMobile", "onRequestClose"]);
    useEffect(function () {
        // Set the app element for accessibility
        ReactModal.setAppElement('#root');
    }, []);
    return (_jsx(ReactModal, __assign({ className: "prism-modal-content ".concat(isMobile ? 'mobile' : 'desktop'), closeTimeoutMS: 200, id: "prism-modal", overlayClassName: "prism-modal-overlay", portalClassName: "".concat(PRISM_CSS_CLASSNAME, " prism-modal"), onRequestClose: onRequestClose, shouldCloseOnOverlayClick: false, ariaHideApp: true }, props)));
}
export function ModalContentContainer(_a) {
    var isMobile = _a.isMobile, children = _a.children, onClose = _a.onClose;
    return (_jsxs("div", { className: "prism-session-view ".concat(isMobile ? 'mobile' : 'desktop'), id: "prism--ModalContentContainer", "data-testid": "prism-predict-modal", children: [_jsx(CloseButton, { onClick: onClose }), _jsx("div", { className: "prism-modal-inner ".concat(isMobile ? 'mobile' : 'desktop'), id: "prism--ModalContentContainer-child", children: children })] }));
}

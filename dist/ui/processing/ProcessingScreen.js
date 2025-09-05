import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { BottomBannerContainer, Confetti } from '../components/';
import Banner from '../components/Banner.js';
export var ProcessingScreen = function (_a) {
    var onClose = _a.onClose;
    var t = useTranslation().t;
    return (_jsxs("div", { style: { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }, children: [_jsx(Confetti, {}), _jsx("div", { style: { position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '20vh' } }), _jsx(BottomBannerContainer, { children: _jsx(Banner, { title: t('finished.title'), bottomTitle: t('finished.description'), buttonText: t('finished.viewResults'), onButtonClick: onClose }) })] }));
};
export default ProcessingScreen;

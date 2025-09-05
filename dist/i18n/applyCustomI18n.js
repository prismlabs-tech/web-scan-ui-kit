var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import i18n from 'i18next';
// Applies inline and/or remote i18n bundles, then optionally sets language
export function applyCustomI18n(config) {
    return __awaiter(this, void 0, void 0, function () {
        var ns, merge, _i, _a, _b, lng, bundle, hasNamespaces, _c, _d, _e, n, res;
        var _this = this;
        var _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!config)
                        return [2 /*return*/];
                    ns = (_f = config.namespace) !== null && _f !== void 0 ? _f : 'translation';
                    merge = (_g = config.merge) !== null && _g !== void 0 ? _g : true;
                    // Merge inline resources. If the object looks namespaced, add each ns; otherwise add to default ns
                    if (config.resources) {
                        for (_i = 0, _a = Object.entries(config.resources); _i < _a.length; _i++) {
                            _b = _a[_i], lng = _b[0], bundle = _b[1];
                            hasNamespaces = typeof bundle === 'object' &&
                                Object.values(bundle).every(function (v) { return typeof v === 'object'; }) &&
                                (Object.prototype.hasOwnProperty.call(bundle, ns) || Object.keys(bundle).length > 1);
                            if (hasNamespaces) {
                                for (_c = 0, _d = Object.entries(bundle); _c < _d.length; _c++) {
                                    _e = _d[_c], n = _e[0], res = _e[1];
                                    i18n.addResourceBundle(lng, n, res, merge, merge);
                                }
                            }
                            else {
                                i18n.addResourceBundle(lng, ns, bundle, merge, merge);
                            }
                        }
                    }
                    if (!config.resourceUrls) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all(Object.entries(config.resourceUrls).map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var list, _loop_1, _i, list_1, url;
                            var lng = _b[0], urls = _b[1];
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        list = Array.isArray(urls) ? urls : [urls];
                                        _loop_1 = function (url) {
                                            var data_1, entries, _d, _e, _f, n, res, _g;
                                            return __generator(this, function (_h) {
                                                switch (_h.label) {
                                                    case 0:
                                                        _h.trys.push([0, 2, , 3]);
                                                        return [4 /*yield*/, fetch(url, { cache: 'no-cache' }).then(function (r) { return r.json(); })];
                                                    case 1:
                                                        data_1 = _h.sent();
                                                        if (data_1 && typeof data_1 === 'object') {
                                                            entries = Object.keys(data_1).some(function (k) { return typeof data_1[k] === 'object'; })
                                                                ? Object.entries(data_1)
                                                                : [[ns, data_1]];
                                                            for (_d = 0, _e = entries; _d < _e.length; _d++) {
                                                                _f = _e[_d], n = _f[0], res = _f[1];
                                                                i18n.addResourceBundle(lng, n, res, merge, merge);
                                                            }
                                                        }
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        _g = _h.sent();
                                                        return [3 /*break*/, 3];
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _i = 0, list_1 = list;
                                        _c.label = 1;
                                    case 1:
                                        if (!(_i < list_1.length)) return [3 /*break*/, 4];
                                        url = list_1[_i];
                                        return [5 /*yield**/, _loop_1(url)];
                                    case 2:
                                        _c.sent();
                                        _c.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _h.sent();
                    _h.label = 2;
                case 2:
                    // Apply fallback and switch active language last
                    if (config.fallbackLanguage)
                        i18n.options.fallbackLng = config.fallbackLanguage;
                    if (!config.language) return [3 /*break*/, 4];
                    return [4 /*yield*/, i18n.changeLanguage(config.language)];
                case 3:
                    _h.sent();
                    _h.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}

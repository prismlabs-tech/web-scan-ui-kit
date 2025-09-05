import { PRISM_LOADED_EVENT, PRISM_SCAN_COMPLETE_EVENT, PRISM_STATE_CHANGE_EVENT, } from './EventNames.js';
var EventBus = /** @class */ (function () {
    function EventBus() {
        this.listeners = {};
    }
    EventBus.prototype.on = function (event, handler) {
        var _this = this;
        var set = this.listeners[event] || new Set();
        set.add(handler);
        this.listeners[event] = set;
        return function () { return _this.remove(event, handler); };
    };
    EventBus.prototype.remove = function (event, handler) {
        var set = this.listeners[event];
        set === null || set === void 0 ? void 0 : set.delete(handler);
    };
    EventBus.prototype.emit = function (event, payload) {
        var set = this.listeners[event];
        set === null || set === void 0 ? void 0 : set.forEach(function (h) {
            try {
                h(payload);
            }
            catch (_a) {
                // swallow
            }
        });
    };
    return EventBus;
}());
export var prismEventBus = new EventBus();

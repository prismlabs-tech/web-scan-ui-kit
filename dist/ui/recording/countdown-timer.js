var CountdownTimer = /** @class */ (function () {
    function CountdownTimer(initialCount) {
        var _this = this;
        this.initialCount = initialCount;
        this.interval = null;
        this.onTick = null;
        this.onFinished = null;
        this.tickHandler = function () {
            if (_this.onTick) {
                _this.onTick(_this.currentCount);
            }
            _this.currentCount--;
            if (_this.currentCount < 0) {
                _this.cancel();
                if (_this.onFinished) {
                    _this.onFinished();
                }
            }
        };
        this.currentCount = initialCount;
    }
    CountdownTimer.prototype.start = function () {
        this.cancel();
        this.currentCount = this.initialCount;
        if (this.currentCount < 0) {
            throw new Error('Countdown cannot start with a negative count');
        }
        this.interval = setInterval(this.tickHandler, 1000);
        // call the first tick immediately
        this.tickHandler();
    };
    CountdownTimer.prototype.cancel = function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    };
    return CountdownTimer;
}());
export { CountdownTimer };

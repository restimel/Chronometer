/**
 * Chronometer workflow
 */

export default {
    timestamp: 0,
    increment: 1,
    offset: 0,
    refTs: performance.now(),
    timer: 0,
    updateDelay: 67,
    start() {
        clearTimeout(this.timer);
        this.refTs = performance.now();
        this.next();
    },
    stop() {
        clearTimeout(this.timer);
        this.count();
        this.offset = this.timestamp;
    },
    reset(offset = 0) {
        this.offset = offset;
        this.timestamp = offset;
        this.refTs = performance.now();
    },
    count() {
        const instant = performance.now();
        const time = instant - this.refTs;
        this.timestamp = this.offset + this.increment * time;
    },
    next() {
        this.count();
        this.timer = setTimeout(() => this.next(), this.updateDelay);
    },
};

const calledEvents = [];

export default {
    computed: {
        resetEvent() {
            return this.currentFormat.events.find((event) => event.id === 'init');
        },

        reachEvents() {
            return this.currentFormat.events.filter((event) => event.enabled && event.trigger === 'reach');
        },
    },
    methods: {
        actionReset() {
            this.lastTs = undefined;
            this.resetEvent.enabled = true;
            this.trigger('reset');
        },

        triggerEvent(event) {
            const actions = event.actions;

            actions.forEach((action) => this.doAction(action, event));
        },

        trigger(evtType) {
            const events = this.currentFormat.events.filter((event) => event.enabled && event.trigger === evtType);

            events.forEach((event) => this.triggerEvent(event));
        },

        getEvent(id, currentEvent) {
            if (!id || id === 'this') {
                return currentEvent;
            }
            return this.currentFormat.events.find((event) => event.id === id);
        },

        enableEvent(eventName, value, currentEvent) {
            if (eventName === '*') {
                this.currentFormat.events.forEach((event) => event.enabled = value);
                return;
            }
            const event = this.getEvent(eventName, currentEvent);
            if (event) {
                event.enabled = value;
            }
        },

        runEvent(eventName, currentEvent) {
            calledEvents.push(currentEvent);

            if (eventName === '*') {
                this.currentFormat.events.forEach((event) => {
                    if (!calledEvents.includes(event)) {
                        this.triggerEvent(event);
                    }
                });
            } else {
                const event = this.getEvent(eventName, currentEvent);
                if (!calledEvents.includes(event)) {
                    this.triggerEvent(event);
                }
            }

            calledEvents.pop();
        },

        changeFormat(format) {
            this.currentFormat.display = format;
        },

        doAction({ action, value }, currentEvent) {
            switch (action) {
                case 'stop':
                    this.chrono.stop();
                    if (currentEvent.trigger === 'reach') {
                        this.chrono.reset(+currentEvent.triggerValue);
                    }
                    break;
                case 'start':
                    this.chrono.start();
                    break;
                case 'set':
                    this.chrono.reset(+value);
                    break;
                case 'color':
                    this.color = value || 'black';
                    break;
                case 'increment':
                    this.chrono.changeIncrement(value);
                    break;
                case 'enable':
                    this.enableEvent(value, true, currentEvent);
                    break;
                case 'disable':
                    this.enableEvent(value, false, currentEvent);
                    break;
                case 'addTime':
                    value = +value || 0;
                    this.chrono.reset(value + this.chrono.timestamp);
                    break;
                case 'runEvent':
                    this.runEvent(value, currentEvent);
                    break;
                case 'format':
                    this.changeFormat(value);
                    break;
                // case 'sound':
                case 'none':
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.warn('Action "%s" is not implemented yet.');
            }
        },

        checkTriggers() {
            const reachEvents = this.reachEvents;

            if (reachEvents.length) {
                const lastTs = this.lastTs;
                const timestamp = this.chrono.timestamp;

                if (typeof lastTs === 'number') {
                    const min = Math.min(lastTs, timestamp);
                    const max = Math.max(lastTs, timestamp);
                    reachEvents.forEach((event) => {
                        const value = +event.triggerValue;
                        if (value > min && value <= max) {
                            this.triggerEvent(event);
                        }
                    });
                }
                this.lastTs = timestamp;
            }
        },
    },
    watch: {
        'chrono.timestamp': function() {
            this.checkTriggers();
        },
    },
};

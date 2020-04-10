

export default {
    computed: {
        resetEvent() {
            return this.currentFormat.events.find((event) => event.id === 'init');
        },

        nextTrigger() {
            const events = this.currentFormat.events.filter((event) => event.enabled && event.trigger === 'reach');
            const increment = this.chrono.increment;
            const sortedEvents = [...events].sort((a, b) => (a - b) * increment);
            return sortedEvents[0];
        },
    },
    methods: {
        actionReset() {
            this.triggerEvent(this.resetEvent);
            this.resetEvent.enabled = true;
        },

        triggerEvent(event) {
            const actions = event.actions;

            event.enabled = false;
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
                event.enable = value;
            }
        },

        doAction({ action, value }, currentEvent) {
            switch (action) {
                case 'stop':
                    this.chrono.stop();
                    break;
                case 'start':
                    this.chrono.start();
                    break;
                case 'set':
                    this.chrono.reset(value);
                    break;
                case 'color':
                    this.color = value || 'black';
                    break;
                case 'increment':
                    value = value || -this.chrono.increment;
                    this.chrono.increment = value;
                    break;
                case 'enable':
                    this.enableEvent(value, true, currentEvent);
                    break;
                case 'disable':
                    this.enableEvent(value, false, currentEvent);
                    break;
                // case 'addTime':
                // case 'playSound':
                default:
                    // eslint-disable-next-line no-console
                    console.warn('Action "%s" is not implemented yet.');
            }
        },

        checkTriggers() {
            const nextTrigger = this.nextTrigger;
            if (nextTrigger) {
                const increment = this.chrono.increment;
                const timestamp = this.chrono.timestamp;
                if (
                    (increment === 1 && timestamp >= nextTrigger.triggerValue)
                 || (increment === -1 && timestamp <= nextTrigger.triggerValue)
                ) {
                    this.triggerEvent(nextTrigger);
                }
            }
        },
    },
    watch: {
        'chrono.timestamp': function() {
            this.checkTriggers();
        },
    },
};

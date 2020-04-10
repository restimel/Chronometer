import shortcuts, {
    running as runningKeys,
    sleeping as sleepingKeys,
    always as alwaysKeys,
} from '@/models/shortcut.js';

export default {
    computed: {
        upCodes() {
            let bindings = alwaysKeys;
            if (this.isCounting) {
                bindings = runningKeys.concat(bindings);
            }

            return bindings.map((binding) => shortcuts[binding]);
        },
        downCodes() {
            let bindings = sleepingKeys;

            return bindings.map((binding) => shortcuts[binding]);
        },
    },
    methods: {
        prevent(evt) {
            evt.preventDefault();
            evt.stopPropagation();
        },
        manageRunningKey(evt) {
            if (evt.repeat) {
                return;
            }
            const code = evt.code;
            if (!this.upCodes.includes(code)) {
                return;
            }
            this.prevent(evt);
            switch (code) {
                case shortcuts.STOP:
                    this.stop();
                    break;
                case shortcuts.RECORD:
                    this.record();
                    break;
                case shortcuts.STOP_RESET:
                    this.reset();
                    break;
                case shortcuts.Special1:
                    this.trigger('Special1');
                    break;
                case shortcuts.Special2:
                    this.trigger('Special2');
                    break;
                case shortcuts.Special3:
                    this.trigger('Special3');
                    break;
                case shortcuts.Special4:
                    this.trigger('Special4');
                    break;
                case shortcuts.Special5:
                    this.trigger('Special5');
                    break;
                default:
                /* This case should not happens */
            }
            this.lockKey = true;
        },

        manageSleepingKey(evt) {
            if (evt.repeat || this.isCounting) {
                return;
            }
            if (this.lockKey) {
                this.lockKey = false;
                return;
            }
            const code = evt.code;
            if (!this.downCodes.includes(code)) {
                return;
            }
            this.prevent(evt);
            switch (code) {
                case shortcuts.START:
                    this.start();
                    break;
                case shortcuts.RESET:
                    this.reset();
                    break;
                default:
                /* This case should not happens */
            }
        },
        startListeners() {
            document.body.addEventListener('keydown', this.manageRunningKey);
            document.body.addEventListener('keyup', this.manageSleepingKey);
            document.body.addEventListener('keypress', this.prevent);
        },
        removeListeners() {
            document.body.removeEventListener('keydown', this.manageRunningKey);
            document.body.removeEventListener('keyup', this.manageSleepingKey);
            document.body.removeEventListener('keypress', this.prevent);
        },
    },
    created() {
        this.startListeners();
    },
    destroyed() {
        this.removeListeners();
    },
};

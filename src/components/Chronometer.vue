<template>
    <div>
        <DigitalTimer
            :timestamp="chrono.timestamp"
            :timeFormat="currentFormat.display"
            :style="'color:' + color"
        />
        <footer
            class="chronometer-footer"
        >
            <button
                class="action-btn"
                :title="mainActionName"
                @click="mainAction"
            >
                {{mainActionIcon}}
            </button>
            <button
                class="action-btn"
                title="Reset"
                @click="reset"
            >
                ⏹
            </button>
            <button
                class="action-btn"
                title="Record current time"
                @click="record"
            >
                ⏺
            </button>
        </footer>
    </div>
</template>

<script>
import Actions from './mods/Actions.js';
import chrono from '@/models/chrono.js';
import {activeFormat} from '@/models/presets.js';
import shortcuts, {
    running as runningKeys,
    sleeping as sleepingKeys,
    always as alwaysKeys,
} from '@/models/shortcut.js';
import DigitalTimer from '@/components/DigitalTimer.vue';

export default {
    name: 'Chronometer',
    mixins: [
        Actions,
    ],
    lockKey: false,
    data: () => ({
        isCounting: false,
        chrono: chrono,
        currentFormat: activeFormat,
        color: 'black',
    }),
    computed: {
        mainActionName() {
            return this.isCounting ? 'Pause' : 'Play';
        },
        mainActionIcon() {
            return this.isCounting ? '⏸' : '▶';
        },
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
        mainAction() {
            const isCounting = this.isCounting;
            if (isCounting) {
                this.stop();
            } else {
                this.start();
            }
        },
        start() {
            this.chrono.start();
            this.isCounting = true;
        },
        stop() {
            this.chrono.stop();
            this.isCounting = false;
        },
        reset() {
            this.stop();
            this.actionReset();
        },
        record() {
            // eslint-disable-next-line no-console
            console.log('TODO record', chrono.timestamp);
        },
        trigger(evt) {
            // eslint-disable-next-line no-console
            console.log('TODO trigger', evt);
        },
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
        init() {
            this.reset();
        },
    },
    watch: {
        currentFormat: function() {
            this.init();
        },
        'currentFormat.inc': function() {
            this.init();
        },
        'currentFormat.start': function() {
            this.init();
        },
    },
    created() {
        this.init();
        this.startListeners();
    },
    destroyed() {
        this.removeListeners();
    },
    components: {
        DigitalTimer,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chronometer-footer {
    text-align: center;
}
.action-btn {
    display: inline-block;
    font-size: 2em;
    width: 2em;
    height: 2em;
    margin: 1em;
    cursor: pointer;
}
</style>

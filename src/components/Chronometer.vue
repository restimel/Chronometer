<template>
    <div>
        <DigitalTimer
            :timestamp="chrono.timestamp"
            :timeFormat="currentFormat.display"
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
import chrono from '@/models/chrono.js';
import {activeFormat} from '@/models/presets.js';
import shortcuts from '@/models/shortcut.js';
import DigitalTimer from '@/components/DigitalTimer.vue';

export default {
    name: 'Chronometer',
    lockKey: false,
    data: () => ({
        isCounting: false,
        chrono: chrono,
        currentFormat: activeFormat,
    }),
    computed: {
        mainActionName() {
            return this.isCounting ? 'Pause' : 'Play';
        },
        mainActionIcon() {
            return this.isCounting ? '⏸' : '▶';
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
            this.chrono.reset();
        },
        record() {
            console.log('TODO record', chrono.timestamp);
        },
        prevent(evt) {
            evt.preventDefault();
            evt.stopPropagation();
        },
        manageKey(evt) {
            if (evt.repeat) {
                return;
            }
            const code = evt.code;
            const up = evt.type === 'keyup';

            switch (code) {
                case shortcuts.RESET:
                    this.reset();
                    this.prevent(evt);
                    break;
                case shortcuts.MAIN:
                    this.prevent(evt);
                    if (up && this.lockKey) {
                        this.lockKey = false;
                        break;
                    }
                    if (this.isCounting && !up || !this.isCounting && up) {
                        this.mainAction();
                        if (!up) {
                            this.lockKey = true;
                        }
                    }
                    break;
                case shortcuts.RECORD:
                    this.prevent(evt);
                    if (!up) {
                        this.record();
                    }
                    break;
                default:
                    /* do nothing */
            }
        },
        startListeners() {
            document.body.addEventListener('keydown', this.manageKey);
            document.body.addEventListener('keyup', this.manageKey);
            document.body.addEventListener('keypress', this.prevent);
        },
        removeListeners() {
            document.body.removeEventListener('keydown', this.manageKey);
            document.body.removeEventListener('keyup', this.manageKey);
            document.body.removeEventListener('keypress', this.prevent);
        },
        init() {
            this.chrono.inc = this.currentFormat.inc;
            this.chrono.stop();
            this.chrono.reset(this.currentFormat.start);
        },
    },
    watch: {
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

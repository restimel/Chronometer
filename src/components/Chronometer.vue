<template>
    <div>
        <DigitalTimer
            :value="chrono.timestamp"
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
import KeyboardMngt from './mods/KeyboardMngt.js';
import chrono from '@/models/chrono.js';
import presets, {activeFormat} from '@/models/presets.js';
import DigitalTimer from '@/components/DigitalTimer.vue';
import { interfaces as sound } from '@/components/Sound.vue';

export default {
    name: 'Chronometer',
    mixins: [
        Actions,
        KeyboardMngt,
    ],
    data: () => ({
        chrono: chrono,
        currentFormat: activeFormat,
        color: 'black',
        presets: presets,
    }),
    computed: {
        mainActionName() {
            return this.isCounting ? 'Pause' : 'Play';
        },
        mainActionIcon() {
            return this.isCounting ? '⏸' : '▶';
        },
        isCounting() {
            return this.chrono.isRunning;
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
            const isCounting = this.isCounting;
            this.chrono.start();
            if (!isCounting) {
                this.trigger('start');
            }
        },
        stop() {
            const isCounting = this.isCounting;
            this.chrono.stop();
            if (isCounting) {
                this.trigger('stop');
            }
        },
        reset() {
            this.stop();
            this.actionReset();
        },
        record() {
            // eslint-disable-next-line no-console
            console.log('TODO record', chrono.timestamp);
        },

        init() {
            this.currentFormat = activeFormat;
            this.reset();
        },
    },
    watch: {
        'presets.activePreset': function() {
            this.init();
        },
    },
    created() {
        sound.removeSound(-1, true);
        this.init();
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

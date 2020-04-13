<template>
    <span class="digital-timer-editor" :class="{hasError: hasError}">
        <span
            class="time-sign"
            @click.prevent.stop="negativeSign = !negativeSign"
        >
            {{negativeSign ? '➖' : '➕'}}
        </span>
        <template v-for="(chunk, idx) of splitted"
        >
            <input v-if="typeof chunk ==='object'"
                :key="`digital-editor-input-${idx}`"
                type="number"
                min="0"
                size="2"
                :title="chunk.fullName"
                v-model="values[chunk.name]"
            >
            <span v-else
                :key="`digital-editor-span-${idx}`"
            >
                {{chunk}}
            </span>
        </template>
    </span>
</template>

<script>
import FormatTs, { conversion } from './mods/FormatTs.js';

export default {
    name: 'DigitalTimerEditor',
    props: {
        value: {
            type: Number,
            required: true,
        },
        timeFormat: {
            type: String,
            resquired: true,
        },
    },
    mixins: [
        FormatTs,
    ],
    data() {
        return {
            values: {
                ms: 0,
                s: 0,
                min: 0,
                h: 0,
                d: 0,
            },
            hasError: false,
            negativeSign: this.value < 0,
        };
    },
    computed: {
        generateTs() {
            const values = this.values;
            let sumMax = 1;
            const ts = conversion.reduce((total, unit, idx) => {
                sumMax *= (conversion[idx - 1] || {max: 1}).max;
                return total + values[unit.name] * sumMax;
            }, 0);
            if (this.negativeSign) {
                return -ts;
            }
            return ts;
        },
    },
    methods: {
        pad(nb, nbZero) {
            let strNb = nb.toString(10);
            const nbLength = strNb.length;

            if (nbLength < nbZero) {
                const zero = new Array(nbZero - nbLength).fill('0').join('');
                return zero + strNb;
            }

            return strNb;
        },

        send() {
            const generateTs = this.generateTs;
            if (Number.isFinite(generateTs)) {
                this.hasError = false;
                this.$emit('input', generateTs);
            } else {
                this.hasError = true;
            }
        },
    },
    watch: {
        isNegative() {
            this.negativeSign = this.isNegative;
        },
        'values.ms': function() {
            this.send();
        },
        'values.s': function() {
            this.send();
        },
        'values.min': function() {
            this.send();
        },
        'values.h': function() {
            this.send();
        },
        'values.d': function() {
            this.send();
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.time-sign {
    cursor: pointer;
}
.hasError {
    color: red;
}
.hasError input {
    border-color: red;
}
input[size="2"] {
    width: 3em;
}
</style>

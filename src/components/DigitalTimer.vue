<template>
    <div
        class="digital-timer"
        :class="{
            inline: inline,
        }"
    >
        {{timerString}}
    </div>
</template>

<script>
import FormatTs from './mods/FormatTs.js';

export default {
    name: 'DigitalTimer',
    props: {
        value: {
            type: Number,
            required: true,
        },
        timeFormat: {
            type: String,
            resquired: true,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },
    mixins: [
        FormatTs,
    ],
    data: () => ({
        values: {
            ms: 0,
            s: 0,
            min: 0,
            h: 0,
            d: 0,
        },
    }),
    computed: {
        timerString() {
            const values = this.values;
            const str = this.splitted.map((chunked) => {
                if (typeof chunked === 'object') {
                    const value = values[chunked.name];
                    return this.pad(value, chunked.nb);
                }
                return chunked;
            }).join('');

            if (this.isNegative) {
                return '-' + str;
            }
            return str;
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
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.digital-timer {
    padding-top: 2em;
    font-size: 5em;
    text-align: center;
    font-family: digital;
    font-weight: bold;
}
.digital-timer.inline {
    padding-top: 0;
    font-size: 1em;
    text-align: inherit;
    font-family: Avenir, Helvetica, Arial, sans-serif;;
    font-weight: normal;
    display: inline;
}
</style>

<style>
@font-face {
  font-family: digital;
  src: url('../assets/triple_dot_digital-7.ttf');
}
</style>

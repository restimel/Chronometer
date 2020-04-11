<template>
    <div class="digital-timer">
        {{timerString}}
    </div>
</template>

<script>

/**
 *  Format
 *  use {TAG} for replacement
 *  use \ for escpaing sequence
 */

const conversion = [{
    name: 'ms',
    max: 1000,
    tag: 'L',
}, {
    name: 's',
    max: 60,
    tag: 'S',
}, {
    name: 'min',
    max: 60,
    tag: 'M',
}, {
    name: 'h',
    max: 24,
    tag: 'H',
}, {
    name: 'd',
    max: Infinity,
    tag: 'D',
}];

export default {
    name: 'DigitalTimer',
    props: {
        timestamp: {
            type: Number,
            required: true,
        },
        timeFormat: {
            type: String,
            resquired: true,
        },
    },
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
        isNegative() {
            return this.timestamp < 0;
        },

        splitted() {
            const timeFormat = this.timeFormat;
            const splittedStr = timeFormat.split(/((?:\\.|[^{])*)(\{[^}]+\})/g);

            return splittedStr.reduce((list, str) => {
                if (str.startsWith('{')) {
                    list.push({
                        tag: str.charAt(1),
                        nb: str.length - 2,
                    });
                } else if (str) {
                    list.push(str.replace(/\\(.)/g, '$1'));
                }
                return list;
            }, []);
        },

        maxUnit() {
            const splitted = this.splitted;
            let max = 0;

            splitted.forEach((chunked) => {
                if (typeof chunked === 'object') {
                    const idx = conversion.findIndex((unit) => unit.tag === chunked.tag);
                    max = Math.max(max, idx);
                }
            });

            return max;
        },

        timerString() {
            const values = this.values;
            const str = this.splitted.map((chunked) => {
                if (typeof chunked === 'object') {
                    const idx = conversion.findIndex((unit) => unit.tag === chunked.tag);
                    const unit = conversion[idx];
                    const valueName = unit.name;
                    const value = values[valueName];

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
        update() {
            let t = Math.floor(Math.abs(this.timestamp));
            const maxUnit = this.maxUnit;
            const values = {};

            let currentUnit = 0;

            while (currentUnit < maxUnit) {
                const unit = conversion[currentUnit];
                const max = unit.max;
                const val = t % max;
                t = (t - val) / max;
                values[unit.name] = val;
                currentUnit++;
            }
            values[conversion[currentUnit].name] = t;

            this.values = Object.assign({
                ms: 0,
                s: 0,
                min: 0,
                h: 0,
                d: 0,
            }, values);
        },
    },
    watch: {
        timestamp() {
            this.update();
        },
    },
    created() {
        this.update();
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
</style>

<style>
@font-face {
  font-family: digital;
  src: url('../assets/triple_dot_digital-7.ttf');
}
</style>

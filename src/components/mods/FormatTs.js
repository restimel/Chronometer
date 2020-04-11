
/**
 *  Format
 *  use {TAG} for replacement
 *  use \ for escaping sequence
 */

export const conversion = [{
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
    conversion: [{
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
    }],
    computed: {
        isNegative() {
            return this.value < 0;
        },

        splitted() {
            const timeFormat = this.timeFormat;
            const splittedStr = timeFormat.split(/((?:\\.|[^{])*)(\{[^}]+\})/g);

            return splittedStr.reduce((list, str) => {
                if (str.startsWith('{')) {
                    const tag = str.charAt(1);
                    const idx = conversion.findIndex((unit) => unit.tag === tag);
                    const unit = conversion[idx];
                    const valueName = unit.name;
                    list.push({
                        tag: tag,
                        nb: str.length - 2,
                        name: valueName,
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
    },
    methods: {
        update() {
            let t = Math.floor(Math.abs(this.value));
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
        value() {
            this.update();
        },
    },
    created() {
        this.update();
    },
};

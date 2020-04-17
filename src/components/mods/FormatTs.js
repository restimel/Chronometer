
/**
 *  Format
 *  use {TAG} for replacement
 *  use \ for escaping sequence
 */

export const conversion = [{
    name: 'ms',
    fullName: 'milliseconds',
    max: 1000,
    tag: 'L',
}, {
    name: 's',
    fullName: 'seconds',
    max: 60,
    tag: 'S',
}, {
    name: 'min',
    fullName: 'minutes',
    max: 60,
    tag: 'M',
}, {
    name: 'h',
    fullName: 'hours',
    max: 24,
    tag: 'H',
}, {
    name: 'd',
    fullName: 'days',
    max: Infinity,
    tag: 'D',
}];

export function isFormatValid(format) {
    if (!format || typeof format !== 'string') {
        return false;
    }

    /*
    ^(?:
        (?:
            \\.
            |
            [^{]
        )*
        (?:
            \{([DHMSL])\1*\}
        )?
    )+$
     */
    const rule = /^(?:(?:\\.|[^{])*(?:\{([DHMSL])\1*\})?)+$/;

    return rule.test(format);
}

export default {
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
                        fullName: unit.fullName,
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

export function __testIsFormatValid() {
    /* eslint-disable no-console */

    console.group('testing isFormatValid');

    const validStr = [
        'simple string',
        'UPPER CASE STRING HH OO',
        'special chars: ^/#&éèà@$€*?!,.;<>()[]-+=×÷·̣¿',
        '{M}',
        '{HH}:{MM}:{SS}.{LL}',
        '{D}days {HHH}:{MMM}:{SS}.{LLLL}',
        '{SS} {SS} {S}',
        'text around {LLLL} format!',
        'A string with } inside',
        'A string with \\\\ as escape sequence',
        'A string with \\{OO} as escape sequence',
    ];
    const invalidStr = [
        '',
        'string with {} only',
        '{YYYY}',
        '{HM}',
        'string with { inside',
        '{H',
        '{H }',
        '{m}',
        '{hh}:{mm}:{ss}.{ll}',
        '{d}days {hhh}:{mmm}:{ss}.{llll}',
        '{ss} {ss} {s}',
    ];

    console.info('Start test');

    console.assert(isFormatValid() === false, 'should return false for undefined argument');
    console.assert(isFormatValid(null) === false, 'should return false for null argument');
    console.assert(isFormatValid(42) === false, 'should return false for number argument');
    console.info('Valid strings');
    validStr.forEach((str) => {
        console.assert(isFormatValid(str) === true, `should be valid: ${JSON.stringify(str)}`);
    });
    console.info('Invalid strings');
    invalidStr.forEach((str) => {
        console.assert(isFormatValid(str) === false, `should be invalid: ${JSON.stringify(str)}`);
    });

    console.info('Finish!');

    console.groupEnd();

    /* eslint-enable no-console */
}

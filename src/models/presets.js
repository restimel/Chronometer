/**
 * Saved presets
 */

const initConf = {
    id: 'default',
    name: '',
    format: {
        display: '{HH}:{MM}:{SS}.{LLL}',
        inc: 1,
        start: 0,
        color: 'black',
        events: [{
            id: 'init',
            trigger: 'reset',
            triggerValue: null,
            enabled: true,
            actions: [{
                action: 'set',
                value: 0,
            }, {
                action: 'color',
                value: 'black',
            }, {
                action: 'increment',
                value: 1,
            }, {
                action: 'enable',
                value: '*',
            }],
        }],
    },
};

const presets = {
    data: [],
    activePreset: '',
    add(preset, init = false) {
        const data = this.data;
        const existing = !init && data.find((item) => item.id === preset.id);
        if (existing) {
            existing.name = preset.name;
            existing.format = preset.format;
            existing.order = preset.order;
        } else {
            const conf = Object.assign({
                order: data.length,
                name: 'preset',
                format: initConf.format,
            }, preset);

            let id = conf.id || conf.name;
            if (!init) {
                while (data.some((item) => item.id === id)) {
                    id += '_';
                }
            }
            data.push(conf);
        }

        if (!init) {
            this.data = Array.from(data.sort((a, b) => a.order - b.order));
            this.save();
        }
    },
    remove(preset) {
        const data = this.data;
        const idx = data.findIndex((item) => item.id === preset.id);
        if (idx !== -1) {
            data.splice(idx, 1);
        }
    },
    save() {
        const json = JSON.stringify(this.data);
        localStorage.chronoPresets = json;
    },
    load() {
        const saved = localStorage.chronoPresets;
        if (!saved) {
            return;
        }
        try {
            const json = JSON.parse(saved);
            json.forEach((preset) => {
                this.add(preset, true);
            });
        } catch(e) {
            // eslint-disable-next-line no-console
            console.error('Load presets failed: %s', e.message);
        }
    },
    setActive(format) {
        if (typeof format === 'string') {
            const preset = this.data.find((item) => item.id === format);
            if (!preset) {
                return false;
            }
            format = preset.format;
            this.activePreset = preset.id;
        } else if (typeof format === 'number') {
            const preset = this.data[format];
            if (!preset) {
                return false;
            }
            format = preset.format;
            this.activePreset = preset.id;
        } else {
            this.activePreset = '';
        }
        Object.assign(activeFormat, format);
    },
};

export const activeFormat = Object.assign({}, initConf.format);

presets.load();
presets.setActive(0);

export default presets;

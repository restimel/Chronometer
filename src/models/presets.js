/**
 * Saved presets
 */

import { deepExtend } from '@/tools.js';

const initConf = {
    id: 'default',
    name: '',
    format: {
        display: '{HH}:{MM}:{SS}.{LLL}',
        events: [{
            id: 'init',
            name: 'initialisation',
            trigger: 'reset',
            triggerValue: null,
            enabled: true,
            actions: [{
                action: 'set',
                value: 0,
            }, {
                action: 'increment',
                value: 1,
            }, {
                action: 'format',
                value: '{HH}:{MM}:{SS}.{LLL}',
            }, {
                action: 'enable',
                value: '*',
            }, {
                action: 'color',
                value: 'black',
            }],
        }],
    },
};

const presets = {
    data: [],
    activePreset: '',

    add(preset, {init = false} = {}) {
        let id = preset.id;
        const data = this.data;
        const existing = !init && this.getPreset(id);

        /* generate a unique id */
        if (!id) {
            let idx = this.data.length;
            do {
                id = `preset ${idx++}`;
            } while (this.getPreset(id));
        }


        if (existing) {
            deepExtend.replaceArray(existing, preset);
        } else {
            const newPreset = deepExtend.replaceArray({}, {
                name: 'preset',
                format: initConf.format,
            }, preset, {
                id,
                order: data.length,
            });
            this.data.push(newPreset);
        }

        if (!init) {
            this.data = Array.from(data.sort((a, b) => a.order - b.order));
            this.save();
        }
        return id;
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
                this.add(preset, {init: true});
            });
        } catch(e) {
            // eslint-disable-next-line no-console
            console.error('Load presets failed: %s', e.message);
        }
    },
    getPreset(id) {
        return this.data.find((item) => item.id === id);
    },
    setActive(format) {
        if (typeof format === 'string') {
            const preset = this.getPreset(format);
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
        deepExtend.replaceArray(activeFormat, format);
    },
};

export const activeFormat = deepExtend({}, initConf.format);

presets.load();
presets.setActive(0);

export default presets;

<template>
    <div class="page">
        <h2>Shortcut settings</h2>

        <div class="keys-display">
            <div class="keys-display__header">
                Action when chronometer is running
            </div>
            <div class="keys-display__header">
                Key
            </div>
            <template v-for="keyItem of running"
            >
                <div
                    :key="'action' + keyItem.key"
                    class="action-name"
                    @click="() => onclick(keyItem)"
                >
                    {{keyItem.text}}
                </div>
                <div
                    :key="'bind' + keyItem.key"
                    class="key-binding"
                    :class="{
                        'is-binding': record === keyItem.key,
                    }"
                    @click="() => onclick(keyItem)"
                >
                    {{ record === keyItem.key ? 'Press key to bind...' : binding[keyItem.key]}}
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import shortcuts, { set as setShortcut } from '@/models/shortcut.js';

export default {
    name: 'ShortcutSetting',
    data: () => ({
        binding: Object.assign({}, shortcuts),
        running: [{
            key: 'MAIN',
            text: 'Start and Stop chronometer',
        }, {
            key: 'RESET',
            text: 'Stop and Reset chronometer',
        }, {
            key: 'RECORD',
            text: 'Record timer',
        }],
        record: null,
    }),
    computed: {
        listenerKey() {
            return this.bindKey.bind(this);
        },
    },
    methods: {
        bindKey(evt) {
            const code = evt.code;
            if (code) {
                const record = this.record;
                setShortcut(record, code);
                this.binding[record] = code;
                evt.preventDefault();
                evt.stopPropagation();
            }
            this.removeListeners();
        },
        registerKey(key) {
            if (this.record) {
                return;
            }
            this.record = key;
            document.body.addEventListener('keydown', this.listenerKey);
        },
        removeListeners() {
            document.body.removeEventListener('keydown', this.listenerKey);
            this.record = null;
        },
        onclick(keyItem) {
            const key = keyItem.key;
            if (this.record === key) {
                this.removeListeners();
            } else {
                this.registerKey(key);
            }
        },
    },
    destroyed() {
        this.removeListeners();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.page {
    text-align: center;
}

.keys-display {
    margin: 3em;
    min-width: 50%;
    display: grid;
    grid-template: 2.5em / 1fr minmax(150px, 25%);
    align-items: center;
}

.keys-display__header {
    background-color: #223322;
    color: #ffffff;
    font-weight: bold;
    padding: 0.5em;
}

.action-name,
.key-binding {
    cursor: pointer;
}
.action-name:hover + .key-binding,
.key-binding:hover {
    color: #cc9900;
}

.is-binding {
    font-style: italic;
    font-weight: normal;
}

</style>

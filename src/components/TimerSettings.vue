<template>
    <div class="page">
        <h2>Timer settings</h2>

        <div class="init-settings">
        </div>

        <section v-for="event of activeFormat.events"
            class="event-section"
            :key="event.id"
        >
            <header class="header-event">
                <button v-if="event.id !== 'init'"
                    class="remove-event-btn icon"
                    @click.prevent.stop="removeEvent(event)"
                    title="Remove this event"
                >
                    ✖
                </button>
            </header>
            <label class="event-label">
                <span>Name:</span>
                <input type="text" v-model="event.name" />
            </label>
            <label class="event-label">
                <span>Trigger on:</span>
                <select
                    v-model="event.trigger"
                    :disabled="event.id === 'init'"
                    @change="eventInit(event)"
                >
                    <option disabled value="never">
                        <i>Select what triggers this event</i>
                    </option>
                    <option value="reach">
                        when timer reach a time value
                    </option>
                    <option value="start">
                        when timer starts
                    </option>
                    <option value="stop">
                        when timer stops
                    </option>
                    <option value="reset">
                        when timer is reset
                    </option>
                    <option value="Special1">
                        when shortcut Special 1 is triggered
                    </option>
                    <option value="Special2">
                        when shortcut Special 2 is triggered
                    </option>
                    <option value="Special3">
                        when shortcut Special 3 is triggered
                    </option>
                    <option value="Special4">
                        when shortcut Special 4 is triggered
                    </option>
                    <option value="Special5">
                        when shortcut Special 5 is triggered
                    </option>
                </select>
            </label>
            <label class="event-label">
                <span></span>
                <template>
                    <DigitalTimerEditor v-if="event.trigger === 'reach'"
                        v-model="event.triggerValue"
                        :timeFormat="activeFormat.display"
                    />
                </template>
            </label>
            <div
                class="action-group-section"
            >
                Actions:
                <div v-for="(action, idx) of event.actions"
                    class="action-section"
                    :key="`action-of-${event.id}-${idx}`"
                >
                    <label>
                        <select
                            v-model="action.action"
                            @change="actionInit(action)"
                            :disabled="event.id === 'init' && idx < nbInitFrozen"
                        >
                            <option value="none" disabled>
                                <i>Choose an action</i>
                            </option>

                            <option value="color">
                                Change timer color
                            </option>
                            <option value="sound">
                                Play a sound
                            </option>
                            <option value="increment">
                                Change counting direction
                            </option>
                            <option value="start">
                                Start sleeping timer
                            </option>
                            <option value="stop">
                                Stop running timer
                            </option>
                            <option value="set">
                                Set a value timer
                            </option>
                            <option value="addTime">
                                Add time
                            </option>
                            <option value="format">
                                Set timer format display
                            </option>
                            <option value="enable">
                                Enable an event
                            </option>
                            <option value="disable">
                                Disable an event
                            </option>
                            <option value="runEvent">
                                Run an event
                            </option>
                        </select>
                        <template>
                            <span v-if="action.action === 'color'">
                                <input type="color" v-model="action.value" />
                            </span>
                            <span v-else-if="['set', 'addTime'].includes(action.action)">
                                <DigitalTimerEditor
                                    v-model="action.value"
                                    :timeFormat="activeFormat.display"
                                />
                            </span>
                            <span v-else-if="action.action === 'increment'">
                                <select
                                    v-model="action.value"
                                >
                                    <option :value="0">
                                        Toggle direction
                                    </option>
                                    <option :value="1">
                                        Set to increment
                                    </option>
                                    <option :value="-1">
                                        Set to decrement
                                    </option>
                                </select>
                            </span>
                            <span v-else-if="['enable', 'disable', 'runEvent'].includes(action.action)">
                                <select
                                    v-model="action.value"
                                >
                                    <option value="">
                                        This event
                                    </option>
                                    <option value="*">
                                        All events
                                    </option>
                                    <hr>
                                    <option v-for="event of events"
                                        :key="`option-in-${event.id}-${idx}-${event.id}`"
                                        :value="event.id"
                                    >
                                        {{event.name}}
                                    </option>
                                </select>
                            </span>
                            <span v-else-if="action.action === 'format'">
                                <UpdateTimeFormat
                                    v-model="action.value"
                                    @input="formatChanged(action, event)"
                                />
                            </span>
                            <span v-else-if="action.action === 'sound'">
                                <SoundSelector
                                    v-model="action.value"
                                />
                            </span>
                        </template>
                    </label>
                    <button v-if="!(event.id === 'init' && idx < nbInitFrozen)"
                        class="remove-action-buton icon"
                        @click.prevent.stop="removeAction(event, action)"
                        title="Remove this action"
                    >
                     ✖
                    </button>
                </div>
                <footer>
                    <button
                        class="add-btn"
                        @click.prevent.stop="addAction(event)"
                        title="Add an action in this event"
                    >
                        <span class="icon">➕</span>
                        Add an action
                    </button>
                </footer>
            </div>
            <aside class="information-message">
                <p v-if="event.id === 'init'">
                    This event cannot be disabled nor deleted.
                </p>
                <!-- <p v-else-if="event.trigger === 'reach'">
                    By default, this event is disabled after its execution.
                </p> -->
            </aside>
        </section>

        <footer>
            <button
                class="add-btn"
                @click.prevent.stop="addEvent"
            >
                <span class="icon">➕</span>
                Add an event
            </button>
        </footer>
        <footer>
            <button
                class="save-preset"
                @click.prevent.stop="saveConfig"
            >
                <span class="icon">💾</span>
                Save this configuration
            </button>
        </footer>
        <aside>
            <ConfirmDialog
                :open="saveDialog"
                @cancel="saveDialog = false"
                @ok="savePreset"
            >
                <section>
                    <p v-if="presetList.length > 0">
                        Override an existing preset:
                        <select
                            v-model="presetId"
                        >
                            <option value="">
                                New preset
                            </option>
                            <hr>
                            <option v-for="preset of presetList"
                                :key="`option-${preset.id}`"
                                :value="preset.id"
                            >
                                {{preset.name}}
                            </option>
                        </select>
                    </p>
                    <p class="choose-preset-name">
                        <label>Choose a preset name</label><br>
                        <input
                            v-model="presetName"
                            placeholder="Choose a name"
                            type="text"
                        >
                    </p>
                </section>
            </ConfirmDialog>
        </aside>
    </div>
</template>

<script>
import presets, { activeFormat } from '@/models/presets.js';
import DigitalTimerEditor from '@/components/DigitalTimerEditor.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import UpdateTimeFormat from '@/components/UpdateTimeFormat.vue';
import SoundSelector from '@/components/SoundSelector.vue';

export default {
    name: 'TimerSettings',
    data: () => ({
        activeFormat: activeFormat,
        nbInitFrozen: 3,
        saveDialog: false,
        presets: presets,
        presetId: presets.activePreset || '',
        presetName: (presets.getPreset(presets.activePreset) || { name: ''}).name,
    }),
    computed: {
        events() {
            return this.activeFormat.events;
        },
        presetList() {
            return this.presets.data;
        },
    },
    methods: {
        addEvent() {
            const events = this.activeFormat.events;
            const id = this.newEventId();
            const event = {
                id: id,
                name: id,
                trigger: 'never',
                triggerValue: null,
                enabled: true,
                actions: [],
            };
            this.addAction(event);
            events.push(event);
        },
        addAction(event) {
            const action = {
                action: 'none',
                value: '',
            };
            event.actions.push(action);
        },
        removeEvent(event) {
            const events = this.activeFormat.events;
            const idx = events.indexOf(event);
            if (idx !== -1) {
                events.splice(idx, 1);
            }
        },
        removeAction(event, action) {
            const actions = event.actions;
            const idx = actions.indexOf(action);
            if (idx !== -1) {
                actions.splice(idx, 1);
            }
        },

        newEventId() {
            const events = this.events;
            let idx = events.length;
            let id;
            do {
                id = `event ${idx++}`;
            } while (events.some((event) => event.id === id));

            return id;
        },

        saveConfig() {
            this.saveDialog = true;
        },

        savePreset() {
            this.saveDialog = false;
            const preset = {
                id: this.presetId,
                name: this.presetName,
                format: this.activeFormat,
            };
            const id = presets.add(preset);
            presets.setActive(id);
        },

        eventInit(event) {
            switch(event.trigger) {
                case 'reach':
                    event.triggerValue = 0;
                    break;
                default:
                    event.triggerValue = null;
            }
        },

        actionInit(action) {
            switch (action.action) {
                case 'color':
                    action.value = 'black';
                    break;
                case 'increment':
                    action.value = 0;
                    break;
                case 'set':
                case 'addTime':
                    action.value = 0;
                    break;
                case 'format':
                    action.value = this.activeFormat.display;
                    break;
                case 'enable':
                case 'disable':
                case 'runEvent':
                    action.value = '';
                    break;
                case 'sound':
                    action.value = '';
                    break;
                default:
                    action.value = '';
            }
        },

        formatChanged(action, event) {
            /* if the display is changed in the init event, chnage all formats */
            if (event.id === 'init' && action.action === 'format') {
                activeFormat.display = action.value;
            }
        },
    },
    watch: {
        presetId() {
            this.presetName = (presets.getPreset(this.presetId) || { name: ''}).name;
        },
    },
    components: {
        DigitalTimerEditor,
        UpdateTimeFormat,
        SoundSelector,
        ConfirmDialog,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.page {
    text-align: center;
    padding: 25px;
}

.add-btn,
.remove-event-btn {
    cursor: pointer;
}

.event-label {
    display: grid;
    grid-template: min-content / 1fr 1fr;
    width: 90%;
}

.event-label *:first-child {
    text-align: right;
    padding: 5px;
}

.event-label *:nth-child(2) {
    text-align: left;
    padding: 5px;
}

.event-section {
    box-shadow: 0 5px 10px black;
    margin-bottom: 10px;
    padding: 5px;
}

.action-group-section {
    margin-bottom: 10px;
}

.action-section {
    padding: 5px;
}

.remove-action-buton {
    margin-left: 25px;
    cursor: pointer;
}
.action-section > label > * {
    margin-left: 10px;
}

.header-event {
    text-align: right;
}

.information-message {
    font-size: 0.8em;
    font-style: italic;
}

.save-preset {
    margin-top: 25px;
    font-size: 1.2em;
    padding: 10px;
    padding-left: 50px;
    padding-right: 50px;
    background-color: #0055ff;
    color: white;
    cursor: pointer;
}

.choose-preset-name {
    line-height: 1.5em;
    text-align: left;
}
.choose-preset-name > input {
    width: 100%;
}
</style>

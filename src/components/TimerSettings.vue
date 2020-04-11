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
                    class="remove-event-btn"
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
                            @change="action.value=''"
                            :disabled="event.id === 'init' && idx < nbInitFrozen"
                        >
                            <option value="none" disabled>
                                <i>Choose an action</i>
                            </option>
                            <option value="start">
                                Start sleeping timer
                            </option>
                            <option value="stop">
                                Stop running timer
                            </option>
                            <option value="color">
                                Change timer color
                            </option>
                            <option value="set">
                                Set a value timer
                            </option>
                            <option value="addTime">
                                Add time
                            </option>
                            <option value="increment">
                                Change counting direction
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
                        </template>
                    </label>
                    <button v-if="!(event.id === 'init' && idx < nbInitFrozen)"
                        class="remove-action-buton"
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
                        ➕ Add an action
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
                ➕ Add an event
            </button>
        </footer>
    </div>
</template>

<script>
import { activeFormat } from '@/models/presets.js';
import DigitalTimerEditor from '@/components/DigitalTimerEditor.vue';

export default {
    name: 'TimerSettings',
    data: () => ({
        activeFormat: activeFormat,
        nbInitFrozen: 2,
    }),
    computed: {
        events() {
            return this.activeFormat.events;
        },
    },
    methods: {
        log(txt) {
            console.log(typeof txt, txt);
        },
        addEvent() {
            const events = this.activeFormat.events;
            const id = this.newEventId();
            events.push({
                id: id,
                name: id,
                trigger: 'never',
                triggerValue: null,
                enabled: true,
                actions: [],
            });
        },
        addAction(event) {
            const action = {
                action: 'none',
                value: null,
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
    },
    components: {
        DigitalTimerEditor,
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
</style>

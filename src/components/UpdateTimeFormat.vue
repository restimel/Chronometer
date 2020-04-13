<template>
    <span>
        <span
            class="time-format-output"
            @click="open = true"
        >
            {{ value }}
        </span>
        <ConfirmDialog
            :open="open"
            @ok="confirm"
            @cancel="open = false; formatStr = value;"
        >
            <label class="main-field">
                Display format:
                <input
                    type="text"
                    v-model="formatStr"
                    :class="{
                        hasError: !isValid,
                    }"
                >
            </label>
            <fieldset>
                <legend>Output example</legend>
                <label>time value (ms):
                    <input
                        type="number"
                        v-model="exampleValue"
                    >
                </label>
                <DigitalTimer
                    :value="exampleValue"
                    :timeFormat="isValid ? formatStr : '--format error--'"
                />
            </fieldset>
        </ConfirmDialog>
    </span>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import DigitalTimer from '@/components/DigitalTimer.vue';
import { isFormatValid } from './mods/FormatTs.js';

export default {
    name: 'UpdateTimeFormat',
    props: {
        value: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            open: false,
            formatStr: this.value,
            exampleValue: 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 25 * 60 * 1000 + 5 * 1000 + 12,
        };
    },
    computed: {
        isValid() {
            return isFormatValid(this.formatStr);
        },
    },
    methods: {
        confirm() {
            if (this.isValid) {
                this.open = false;
                this.$emit('input', this.formatStr);
            } else {
                this.open = false;
                setTimeout(() => {
                    this.open = true;
                }, 10);
            }
        },
    },
    watch: {
        value() {
            this.formatStr = this.value;
        },
    },
    components: {
        ConfirmDialog,
        DigitalTimer,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.time-format-output {
    cursor: pointer;
}

.hasError {
    border-color: red;
}

.main-field {
    display: block;
    font-size: 1.4em;
    margin: 15px;
}
</style>

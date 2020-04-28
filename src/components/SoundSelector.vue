<template>
    <span class="sound-selector">
        <select
            :value="selectValue"
            @input="(evt) => internalValue = evt.currentTarget.value"
            @change="checkEmit"
        >
            <option value="" disabled>
                Choose a sound
            </option>
            <hr>
            <option value="url::">
                Sound from internet
            </option>
            <hr>
            <option v-for="sound of soundList"
                :key="`sound--${sound.id}`"
                :value="'sound::' + sound.id"
            >
                {{sound.desc}}
            </option>
        </select>

        <input v-if="currentType === 'url'"
            :value="currentValue"
            @input="(evt) => internalValue = `url::${evt.currentTarget.value}`"
            @change="checkEmit"

            placeholder="Enter sound url"
            type="url"
        />

        <button v-if="playId === -1"
            class="icon"
            :disabled="internalValue === ''"
            @click="play"
        >
            ▶
        </button>
        <button v-else
            class="icon"
            @click="stop"
        >
            ⏹
        </button>
    </span>
</template>

<script>
import { soundList, interfaces as sound } from '@/components/Sound.vue';

export default {
    name: 'SoundSelector',
    props: {
        value: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            soundList: soundList,
            internalValue: this.value,
            playId: -1,
        };
    },
    computed: {
        currentType() {
            const [type] = this.internalValue.split('::');
            return type;
        },
        currentValue() {
            console.log('val', this.internalValue);
            const [,value] = this.internalValue.split('::');
            return value;
        },
        selectValue() {
            if (this.currentType === 'url') {
                return 'url::';
            }
            return this.internalValue;
        },
    },
    methods: {
        play() {
            const value = this.internalValue;

            if (!value) {
                return;
            }
            if (this.playId !== -1) {
                this.stop();
            }

            this.playId = sound.playSound(value, () => this.playId = -1);
        },
        stop() {
            const playId = this.playId;

            if (playId === -1) {
                return;
            }
            sound.removeSound(playId);
            this.playId = -1;
        },
        checkEmit() {
            const internalValue = this.internalValue;
            const value = this.value;
            const currentType = this.currentType;
            const currentValue = this.currentValue;

            if (currentType && currentValue && internalValue !== value) {
                this.$emit('input', internalValue);
            }
        },
    },
    watch: {
        value: function() {
            this.internalValue = this.value;
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
    cursor: pointer;
}
</style>

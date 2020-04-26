<template>
    <span class="sound-selector">
        <select
            v-model="internalValue"
            @change="checkEmit"
        >
            <option value="" disabled>
                Choose a sound
            </option>
            <hr>
            <option value="¤url¤" disabled>
                Choose a sound
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
            @input="(value) => internalValue = `url::${value}`"
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
            const [,value] = this.internalValue.split('::');
            return value;
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
            if (this.type &&  this.value) {
                this.$emit('input', this.internalValue);
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

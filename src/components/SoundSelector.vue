<template>
    <span class="sound-selector">
        <select
            v-model="internalValue"
            @change="$emit('input', internalValue)"
        >
            <option value="" disabled>
                Choose a sound
            </option>
            <option v-for="sound of soundList"
                :key="`sound--${sound.id}`"
                :value="sound.id"
            >
                {{sound.desc}}
            </option>
        </select>

        <button v-if="playId === -1"
            :disabled="internalValue === ''"
            @click="play"
        >
            ▶
        </button>
        <button v-else
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

<template>
    <div
        class="sound-manager"
    >
        <audio v-for="sound of sounds"
            :key="`${sound.sound} - ${sound.uid}`"
            autoplay
            @ended="removeSound(sound.uid)"
            @emptied="removeSound(sound.uid)"
            @error="(evt) => onError(evt, sound.uid)"
        >
            <source :src="sound.sound" :type="sound.type">

        </audio>
    </div>
</template>

<script>

let uid = 0;

/* TODO mute */

export const soundList = [{
    desc: 'Bronze bell 1',
    id: 'bronzeBell1',
    path: 'bronzebell1.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Bronze bell 2',
    id: 'bronzeBell2',
    path: 'bronzebell2.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Bronze bell 30',
    id: 'bronzeBell30',
    path: 'bronzebell30.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Daitokuji bell',
    id: 'daitokuji',
    path: 'daitokuji-temple-bell.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Cow bell',
    id: 'cowBell',
    path: 'cowbell.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Gong',
    id: 'gong',
    path: 'gong.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Tiny bell 1',
    id: 'tinybell1',
    path: 'tinybell1.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Tiny bell 2',
    id: 'tinybell2',
    path: 'tinybell2.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Tiny bell 3',
    id: 'tinybell3',
    path: 'tinybell3.ogg',
    type: 'audio/ogg',
}, {
    desc: 'Tiny bell 10',
    id: 'tinybell10',
    path: 'tinybell10.ogg',
    type: 'audio/ogg',
}];

export const interfaces = {
    playSound: (...args) => {
        /* fail to load restart a litlle bit later */
        setTimeout(() => interfaces.playSound(...args), 0);
    },
    removeSound: (...args) => {
        /* fail to load restart a litlle bit later */
        setTimeout(() => interfaces.removeSound(...args), 0);
    },
};

export default {
    name: 'Sound',
    data() {
        return {
            sounds: [],
            publicPath: process.env.BASE_URL,
            callbacks: new Map(),
        };
    },
    created() {
        interfaces.playSound = this.playSound.bind(this);
        interfaces.removeSound = this.removeSound.bind(this);
    },
    methods: {
        getIdx(uid) {
            if (uid < 0) {
                return -1;
            }
            return this.sounds.findIndex((sound) => sound.uid === uid);
        },

        playSound(sound, cb) {
            if (typeof sound === 'string') {
                const soundData = soundList.find((snd) => snd.id === sound);
                const soundId = uid++;

                this.sounds.push({
                    uid: soundId,
                    sound: `${this.publicPath}${soundData.path}`,
                    type: soundData.type,
                });

                if (typeof cb === 'function') {
                    this.callbacks.set(soundId, cb);
                }

                return soundId;
            }
            return -1;
        },

        removeSound(uid = -1, noCallback = false) {
            const idx = this.getIdx(uid);
            const callbacks = this.callbacks;

            if (idx >= 0) {
                this.sounds.splice(idx, 1);
                if (!noCallback && callbacks.has(uid)) {
                    callbacks.get(uid)(uid);
                }
                callbacks.delete(uid);
            } else {
                this.sounds.splice(0);
                if (!noCallback) {
                    callbacks.forEach((cb, uid) => cb(uid));
                }
                callbacks.clear();
            }
        },

        onError(evt, uid) {
            // TODO better description
            // console.warn(`Issue while playing sound`, evt);
            // console.error(evt.target.error.message, evt.target.error.code);
            this.removeSound(uid);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sound-manager {
    visibility:hidden;
}
</style>

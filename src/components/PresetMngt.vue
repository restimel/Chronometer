<template>
    <div class="page">
        <h2>Presets management</h2>

        <div class="presets-display">
            <div class="presets-display__header">
                Preset name
            </div>
            <div class="presets-display__header">
                Actions
            </div>
            <template v-for="preset of presetList"
            >
                <div
                    :key="preset.id"
                    class="preset-name"
                >
                    {{preset.name}}
                </div>
                <div
                    :key="`action-${preset.id}`"
                    class="actions-area"
                >
                    <button
                        class="icon"
                        title="Edit name of this preset"
                        @click="(editNamePreset = preset, presetName = preset.name)"
                    >
                        📝
                    </button>
                    <button
                        class="icon"
                        title="Delete this preset"
                        @click="deletedPreset = preset"
                    >
                        🗑
                    </button>
                </div>
            </template>
        </div>
        <ConfirmDialog
            :open="editNamePreset !== null"
            @cancel="editNamePreset = null"
            @ok="editName"
        >
            <label>
                New Name:
                <input
                    type="text"
                    v-model="presetName"
                >
            </label>
        </ConfirmDialog>
        <ConfirmDialog
            :open="deletedPreset !== null"
            @cancel="deletedPreset = null"
            @ok="deletePreset"
        >
            Do you want to delete the preset "{{deletedPreset && deletedPreset.name}}"?
        </ConfirmDialog>
    </div>
</template>

<script>
import presets, {activeFormat} from '@/models/presets.js';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

export default {
    name: 'PresetMngt',
    data: () => ({
        currentFormat: activeFormat,
        presets: presets,
        editNamePreset: null,
        presetName: '',
        deletedPreset: null,
    }),
    computed: {
        presetList() {
            return this.presets.data;
        },
    },
    methods: {
        editName() {
            this.editNamePreset.name = this.presetName;
            this.presets.add(this.editNamePreset);
            this.editNamePreset = null;
        },
        deletePreset() {
            this.presets.remove(this.deletedPreset);
            this.deletedPreset = null;
        },
    },
    watch: {

    },
    components: {
        ConfirmDialog,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
    text-align: center;
}

.presets-display {
    margin: 3em;
    min-width: 50%;
    display: grid;
    grid-template: 2.5em / 1fr minmax(150px, 25%);
    align-items: center;
}

.presets-display__header {
    background-color: #223322;
    color: #ffffff;
    font-weight: bold;
    padding: 0.5em;
}

button {
    cursor: pointer;
    margin-left: 5px;
    font-size: 1.2em;
}
</style>

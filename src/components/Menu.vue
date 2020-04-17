<template>
    <nav>
        <h1>Actions</h1>
        <ul>
            <li v-for="page of pages"
                :key="page.id"
                class="page-link"
                :class="{
                    active: page.id === active,
                }"
                @click="$emit('change', page.id)"
            >
                {{page.text}}
            </li>
        </ul>
        <details v-if="presets.data.length > 0"
            open
        >
            <summary>Presets</summary>
            <ul>
                <li v-for="preset of presets.data"
                    :key="preset.id"
                    class="preset-link"
                    :class="{
                        active: preset.id === presets.activePreset,
                    }"
                    @click="presets.setActive(preset.id)"
                >
                    {{preset.name}}
                </li>
            </ul>
            <div
                class="page-link"
                @click.prevent.stop="$emit('change', 'PresetMngt')"
            >
                Manage presets
            </div>
        </details>
    </nav>
</template>

<script>
import presets from '@/models/presets.js';

export default {
    name: 'Menu',
    props: {
        active: String,
    },
    data: () => ({
        pages: [{
            id: 'Chronometer',
            text: 'Chronometer',
        }, {
            id: 'ShortcutSettings',
            text: 'Keyboard shortcuts',
        }, {
            id: 'TimerSettings',
            text: 'Configure your timer',
        }],
        presets: presets,
    }),
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.preset-link,
.page-link {
    color: #42b983;
    cursor: pointer;
}
.preset-link:hover,
.page-link:hover {
    font-weight: bold;
}
.active {
    color: #cc8822;
    font-weight: bold;
}
</style>

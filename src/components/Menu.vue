<template>
    <nav>
        <h1>Actions</h1>
        <ul>
            <li v-for="page of pages"
                :key="page.id"
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
                    :class="{
                        active: preset.id === presets.activePreset,
                    }"
                    @click="presets.setActive(preset.id)"
                >
                    {{preset.name}}
                </li>
            </ul>
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
li {
    color: #42b983;
    cursor: pointer;
}
li:hover {
    font-weight: bold;
}
.active {
    color: #cc8822;
    font-weight: bold;
}
</style>

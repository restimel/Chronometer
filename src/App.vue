<template>
    <div id="app">
        <Menu
            class="menu"
            :active="activePage"
            @change="(value) => activePage = value"
        />
        <section
            class="content"
        >
            <component
                :is="activePage"
            />
        </section>
    </div>
</template>

<script>
import Menu from './components/Menu.vue';
import Chronometer from './components/Chronometer.vue';
import ShortcutSettings from './components/ShortcutSettings.vue';

export default {
    name: 'App',
    data: () => ({
        activePage: 'Chronometer',
    }),
    components: {
        Menu,
        Chronometer,
        ShortcutSettings,
    },
};
</script>

<style scoped>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    display: grid;
    grid-template: "menu content" 1fr / 200px 1fr;
}

.menu {
    grid-area: menu;
}

.content {
    grid-area: content;
}

</style>

<script setup>

//import onMounted and watch
import { onMounted, watch } from 'vue';

//import store theme
import { useTheme } from "./stores/theme";

//init store theme
const themeStore = useTheme();

// Set theme on component mount
onMounted(() => {
    document.documentElement.setAttribute('data-bs-theme', themeStore.theme);
});

// Watch theme state for changes
watch(
  () => themeStore.theme,
  (newTheme) => {
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  }
);

</script>

<template>
    <router-view />
</template>
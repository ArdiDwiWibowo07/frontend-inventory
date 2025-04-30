<script setup>
//import component Header
import Header from '../components/Header.vue';
</script>

<template>
    <div class="page">
        <Header />
        <div class="page-wrapper">
            <slot/>
        </div>
      </div>
</template>
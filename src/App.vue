<template>
  <div id="app">
    <HeaderBar />
    <router-view />
  </div>
</template>

<script setup>
import HeaderBar from './components/HeaderBar.vue';
</script>

<style>
body {
  margin: 0;
  background-color: #111;
  color: white;
}
</style>

<template>
  <div class="banner" v-if="movie">
    <img :src="imageUrl" class="banner-img" />
    <div class="banner-info">
      <h1>{{ movie.title }}</h1>
      <p>{{ movie.overview }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ movie: Object });

const imageUrl = computed(() =>
  props.movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${props.movie.backdrop_path}`
    : ""
);
</script>

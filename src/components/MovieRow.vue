<template>
  <div class="movie-row">
    <h2>{{ title }}</h2>
    <div class="movie-list">
      <img
        v-for="m in movies"
        :key="m.id"
        :src="`https://image.tmdb.org/t/p/w300${m.poster_path}`"
        class="movie-poster"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  title: String,
  fetchUrl: String
});

const movies = ref([]);

onMounted(async () => {
  const res = await fetch(props.fetchUrl);
  const data = await res.json();
  movies.value = data.results;
});
</script>

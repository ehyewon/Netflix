<template>
  <div class="home">
    <Banner :movie="featuredMovie" />

    <MovieRow title="인기 영화" :fetchUrl="popularMoviesUrl" />
    <MovieRow title="최신 영화" :fetchUrl="newReleasesUrl" />
    <MovieRow title="액션 영화" :fetchUrl="actionMoviesUrl" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Banner from "@/components/Banner.vue";
import MovieRow from "@/components/MovieRow.vue";
import { movieApi } from "@/services/movieApi";

// 영화 데이터
const featuredMovie = ref(null);

const popularMoviesUrl = movieApi.getPopularMoviesURL();
const newReleasesUrl = movieApi.getPopularMoviesURL(2);
const actionMoviesUrl = movieApi.getMoviesByGenreURL(28);

// 스크롤 이벤트 (헤더)
let scrollHandler;

onMounted(async () => {
  featuredMovie.value = await movieApi.fetchFeaturedMovie();

  scrollHandler = () => {
    const header = document.querySelector(".app-header");
    if (window.scrollY > 50) header?.classList.add("scrolled");
    else header?.classList.remove("scrolled");
  };
  window.addEventListener("scroll", scrollHandler);
});

onUnmounted(() => {
  window.removeEventListener("scroll", scrollHandler);
});
</script>

<style scoped>
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>

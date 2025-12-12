<script setup>
import { ref, onMounted, provide } from "vue";
import FeaturedMovie from "@/components/FeaturedMovie.vue";
import MovieList from "@/components/MovieList.vue";
import MovieDetail from "@/components/MovieDetail.vue";

import { getPopular, getAction, getTopRated } from "@/api/movieApi";

// 상태
const featured = ref(null);
const popular = ref([]);
const action = ref([]);
const topRated = ref([]);

const selectedMovie = ref(null);

// 상세 모달 열기
function openDetail(movie) {
  selectedMovie.value = movie;
}
provide("openDetail", openDetail);

// API 호출
onMounted(async () => {
  popular.value = await getPopular();     // 인기
  action.value = await getAction();       // 액션
  topRated.value = await getTopRated();   // 평점 높은 영화

  // 대표 영화는 인기 영화 첫 번째
  featured.value = popular.value[0];
});
</script>

<template>
  <div>
    <!-- 메인 배너 -->
    <FeaturedMovie v-if="featured" :movie="featured" />

    <!-- 영화 리스트 -->
    <MovieList title="🔥 인기 영화" :movies="popular" />
    <MovieList title="⭐ 평점 높은 영화" :movies="topRated" />
    <MovieList title="💥 액션 영화" :movies="action" />

    <!-- 상세 모달 -->
    <MovieDetail
      v-if="selectedMovie"
      :movie="selectedMovie"
      @close="selectedMovie = null"
    />
  </div>
</template>

<style scoped>
div {
  background: #000;
  color: #fff;
}
</style>


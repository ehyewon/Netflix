<script setup>
import { useWishlist } from "@/composables/useWishlist.js";
import MovieCard from "@/components/MovieCard.vue";

const { wishlist } = useWishlist();
</script>

<template>
  <div class="wishlist-container">

    <div v-if="wishlist.length === 0" class="empty">
      아직 찜한 영화가 없어요
    </div>

    <div class="movie-grid">
      <MovieCard
        v-for="movie in wishlist"
        :key="movie.id"
        :movie="movie"
        mode="wishlist"
      />
    </div>
  </div>
</template>

<style scoped>
.wishlist-container {
  padding: 40px 50px;
  color: #fff;
}

.title {
  font-size: 26px;
  margin-bottom: 25px;
  font-weight: bold;
}

.empty {
  margin-top: 60px;
  font-size: 22px;
  text-align: center;
  opacity: 0.8;
}

/* ⭐ 찜 목록 그리드 정렬 (카드 간격 넓힘) */
.movie-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* 카드 크기 통일 */
  gap: 32px 28px; /* ⭐ 가로 28px / 세로 32px 간격 */
  padding-bottom: 40px;
}
</style>

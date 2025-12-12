<template>
  <div class="movie-card" @click="handleClick">
    <!-- ❤️ 찜 아이콘 -->
    <div v-if="isWishlisted(movie.id)" class="wish-icon">❤️</div>

    <img :src="imgUrl" :alt="movie.title" class="poster" />

    <!-- 🎬 검색 페이지에서만 영화 제목 -->
    <p v-if="mode === 'search'" class="movie-title">
      {{ movie.title }}
    </p>

    <!-- ⭐ 홈/인기에서만 찜 버튼 -->
    <button
      v-if="mode !== 'wishlist' && mode !== 'search'"
      class="wish-btn"
      @click.stop="toggleWishlist(movie)"
    >
      {{ isWishlisted(movie.id) ? "찜 취소" : "찜하기" }}
    </button>
  </div>
</template>

<script setup>
import { inject, computed } from "vue";
import { useWishlist } from "@/composables/useWishlist.js";

const props = defineProps({
  movie: Object,
  mode: {
    type: String,
    default: "default" // default | wishlist | search
  }
});

const openDetail = inject("openDetail");
const { isWishlisted, toggleWishlist } = useWishlist();

const handleClick = () => {
  if (props.mode === "wishlist" || props.mode === "search") {
    toggleWishlist(props.movie);
  } else {
    openDetail?.(props.movie);
  }
};

const imgUrl = computed(() =>
  props.movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : "/no-image.png"
);
</script>

<style scoped>
.movie-card {
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.poster {
  width: 100%;
  height: 330px;
  object-fit: cover;
  border-radius: 10px;
}

.movie-title {
  margin-top: 10px;
  font-size: 15px;
  text-align: center;
  color: #eee;
}

.wish-icon {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 22px;
  color: #ff4b4b;
  z-index: 5;
}

.wish-btn {
  width: 100%;
  margin-top: 8px;
  height: 38px;
  border-radius: 6px;
  border: none;
  background: #222;
  color: white;
}
</style>

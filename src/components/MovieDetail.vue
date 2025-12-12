<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <img
        v-if="movie.backdrop_path"
        class="backdrop"
        :src="`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`"
      />

      <h2>{{ movie.title }}</h2>
      <p class="overview">{{ movie.overview }}</p>

      <div class="info">
        <span>⭐ {{ movie.vote_average }}</span>
        <span>📅 {{ movie.release_date }}</span>
      </div>

      <button class="close-btn" @click="close">닫기</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movie: { type: Object, required: true },
})

const emits = defineEmits(["close"])

function close() {
  emits("close")
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: #111;
  width: 600px;
  padding: 20px;
  border-radius: 10px;
  color: white;
}

.backdrop {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}

.overview {
  margin: 10px 0;
  line-height: 1.5;
  opacity: 0.9;
}

.info span {
  margin-right: 10px;
  opacity: 0.8;
}

.close-btn {
  margin-top: 15px;
  padding: 8px 15px;
  background: #e50914;
  border: none;
  color: white;
  cursor: pointer;
}
</style>

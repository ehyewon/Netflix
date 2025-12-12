<template>
  <div class="popular-page">

    <!-- 페이지 제목 -->
    <h1>인기 영화</h1>

    <!-- 보기 전환 버튼 -->
    <div class="view-toggle">
      <button
        :class="{ active: viewMode === 'grid' }"
        @click="setView('grid')"
      >
        ■
      </button>
      <button
        :class="{ active: viewMode === 'scroll' }"
        @click="setView('scroll')"
      >
        ☰
      </button>
    </div>

    <!-- GRID MODE -->
    <div v-if="viewMode === 'grid'" class="grid-container">
      <div class="grid">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          mode="wishlist"
        />
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">이전</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">다음</button>
      </div>
    </div>

    <!-- SCROLL MODE -->
    <div
      v-if="viewMode === 'scroll'"
      class="scroll-container"
      ref="scrollBox"
    >
      <MovieCard
        v-for="movie in scrollMovies"
        :key="movie.id"
        :movie="movie"
        mode="wishlist"
      />

      <div class="loading" v-if="loading">불러오는 중...</div>

      <!-- TOP 버튼 -->
      <button v-if="showTop" class="top-btn" @click="goTop">
        ↑ TOP
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import MovieCard from "@/components/MovieCard.vue";
import { getPopular } from "@/api/movieApi";

/* 보기 모드 */
const viewMode = ref("grid");
const setView = (mode) => (viewMode.value = mode);

/* ===== GRID MODE ===== */
const movies = ref([]);
const page = ref(1);
const totalPages = ref(10);

async function loadGridMovies() {
  movies.value = await getPopular(page.value);
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++;
    loadGridMovies();
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--;
    loadGridMovies();
  }
}

/* ===== SCROLL MODE ===== */
const scrollMovies = ref([]);
const scrollPage = ref(1);
const scrollBox = ref(null);
const loading = ref(false);
const showTop = ref(false);

async function loadScrollMovies() {
  if (loading.value) return;
  loading.value = true;

  const newMovies = await getPopular(scrollPage.value);
  scrollMovies.value.push(...newMovies);

  loading.value = false;
}

function goTop() {
  scrollBox.value?.scrollTo({ top: 0, behavior: "smooth" });
}

function handleScroll() {
  const box = scrollBox.value;
  if (!box) return;

  showTop.value = box.scrollTop > 200;

  const isBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 100;

  if (isBottom) {
    scrollPage.value++;
    loadScrollMovies();
  }
}

/* 모드 바뀔 때 스크롤 이벤트 재설정 */
watch(viewMode, async (mode) => {
  if (mode === "scroll") {
    await nextTick();
    scrollBox.value?.addEventListener("scroll", handleScroll);
  }
});

/* 초기 로딩 */
onMounted(() => {
  loadGridMovies();
  loadScrollMovies();
});
</script>

<style scoped>
.popular-page {
  padding-top: 20px; /* 기존 60 → 40으로 줄임 */
  width: 100%;
  color: white;
  min-height: 100vh;
}

h1 {
  margin-left: 20px;  /* 기존 30 → 20 */
  margin-bottom: 0px; /* 기존 20 → 10 */
}

/* 보기 모드 버튼 */
.view-toggle {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-right: 20px;   /* 기존 30 → 20 */
  margin-bottom: 15px; /* 기존 20 → 15 */
}

/* GRID MODE */
.grid {
  padding: 0 20px; /* 기존 30 → 20 */
  margin-top: 10px; /* 기존 20 → 10 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    /* ⭐ 딱 2줄만 보이도록 설정 */
  grid-auto-rows: 330px;        /* 카드 높이 */
  max-height: calc(330px * 2 + 30px); /* 2줄 + gap */
  overflow: hidden;

  gap: 30px;
}


.view-toggle button {
  width: 45px;
  height: 45px;
  border-radius: 6px;
  border: none;
  background: #333;
  color: white;
  cursor: pointer;
  font-size: 24px;
}

.view-toggle .active {
  background: #e50914;
}

/* GRID MODE */
.grid {
  padding: 0 30px;
  margin-top: 20px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* 여유 */
  gap: 32px; /* 덜 촘촘하게 */
}

.pagination {
  margin-top: 25px;
  text-align: center;
}

.pagination button {
  padding: 6px 16px;
  margin: 0 10px;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* SCROLL MODE */
.scroll-container {
  height: 80vh;
  overflow-y: auto;
  padding: 0 30px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 28px;

  justify-items: center;    /* ⭐ 각 카드 가운데 정렬 */
  align-items: start;        /* 위쪽 정렬 */
}


.loading {
  text-align: center;
  margin: 15px 0;
  color: #bbb;
}

/* TOP 버튼 */
.top-btn {
  position: fixed;
  bottom: 35px;
  right: 35px;
  padding: 12px 18px;
  background: #e50914;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 16px;
}
</style>

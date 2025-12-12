<template>
  <div class="search-page">
    <!-- 타이틀 -->
    <h1 class="title">🎬 영화 검색</h1>

    <!-- 검색 -->
    <div class="search-bar">
      <input
        v-model="keyword"
        placeholder="영화를 검색하세요"
        @keyup.enter="searchMovies"
      />
      <button @click="searchMovies">검색</button>
    </div>

    <!-- 최근 검색어 -->
    <div v-if="recentKeywords.length" class="recent">
      <span
        v-for="word in recentKeywords"
        :key="word"
        @click="clickRecent(word)"
      >
        {{ word }}
      </span>
    </div>

    <!-- 필터 + 초기화 -->
    <div class="filter-row">
      <div class="filters">
        <select v-model="genre">
          <option value="">장르 전체</option>
          <option v-for="g in genres" :key="g.id" :value="g.id">
            {{ g.name }}
          </option>
        </select>

        <select v-model="rating">
          <option value="">평점 전체</option>
          <option value="6">6점 이상</option>
          <option value="7">7점 이상</option>
          <option value="8">8점 이상</option>
        </select>

        <select v-model="sort">
          <option value="">정렬 전체</option>
          <option value="popularity.desc">인기순</option>
          <option value="release_date.desc">최신 개봉순</option>
          <option value="vote_average.desc">평점 높은 순</option>
          <option value="vote_average.asc">평점 낮은 순</option>
        </select>
      </div>

      <button class="reset-btn" @click="resetFilter">초기화</button>
    </div>

    <!-- 영화 목록 -->
    <div class="movie-grid">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
        mode="wishlist"
      />
    </div>

    <!-- 🔄 로딩 애니메이션 -->
    <div v-if="loading" class="loading-wrap">
      <div class="spinner"></div>
      <p class="loading-text"> Loading...</p>
    </div>

    <!-- TOP 버튼 -->
    <button v-if="showTop" class="top-btn" @click="goTop">
      TOP
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";
import { useAuth } from "@/composables/useAuth.js";

/* 상태 */
const keyword = ref("");
const movies = ref([]);
const baseMovies = ref([]);

const genre = ref("");
const rating = ref("");
const sort = ref("");

const { auth } = useAuth();
const recentKey = computed(() =>
  auth.email ? `recentKeywords_${auth.email}` : null
);

const recentKeywords = ref([]);
const showTop = ref(false);

/* 🔥 무한 스크롤 상태 */
const page = ref(1);
const loading = ref(false);
const isSearchMode = ref(false);

/* 장르 */
const genres = ref([
  { id: 28, name: "액션" },
  { id: 35, name: "코미디" },
  { id: 18, name: "드라마" },
  { id: 10749, name: "로맨스" },
  { id: 53, name: "스릴러" },
  { id: 878, name: "SF" }
]);

/* 최초 로드 */
onMounted(async () => {
  await loadDiscover();

  if (recentKey.value) {
    recentKeywords.value = JSON.parse(
      localStorage.getItem(recentKey.value) || "[]"
    );
  }

  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

/* 🔥 discover 로드 */
async function loadDiscover() {
  if (loading.value) return;
  loading.value = true;

  const res = await axios.get(
    "https://api.themoviedb.org/3/discover/movie",
    {
      params: {
        language: "ko-KR",
        region: "KR",
        page: page.value
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
      }
    }
  );

  movies.value.push(...res.data.results);
  baseMovies.value.push(...res.data.results);

  page.value++;
  loading.value = false;
}

/* 검색 */
async function searchMovies() {
  if (!keyword.value.trim()) return;

  saveRecent(keyword.value);

  page.value = 1;
  movies.value = [];
  isSearchMode.value = true;

  await loadSearch();
}

/* 🔥 검색 페이지 로드 */
async function loadSearch() {
  if (loading.value) return;
  loading.value = true;

  const res = await axios.get(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: keyword.value,
        language: "ko-KR",
        region: "KR",
        page: page.value
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
      }
    }
  );

  movies.value.push(...res.data.results);
  page.value++;
  loading.value = false;
}

/* 최근 검색어 */
function saveRecent(word) {
  if (!recentKey.value) return;

  let list = JSON.parse(localStorage.getItem(recentKey.value) || "[]");
  list = list.filter(v => v !== word);
  list.unshift(word);
  if (list.length > 5) list.pop();

  localStorage.setItem(recentKey.value, JSON.stringify(list));
  recentKeywords.value = list;
}

function clickRecent(word) {
  keyword.value = word;
  searchMovies();
}

/* 필터링 */
const filteredMovies = computed(() => {
  let result = movies.value
    .filter(m =>
      genre.value ? m.genre_ids.includes(Number(genre.value)) : true
    )
    .filter(m =>
      rating.value ? m.vote_average >= Number(rating.value) : true
    );

  if (!sort.value) return result;

  return [...result].sort((a, b) => {
    if (sort.value === "popularity.desc") return b.popularity - a.popularity;
    if (sort.value === "release_date.desc")
      return new Date(b.release_date) - new Date(a.release_date);
    if (sort.value === "vote_average.desc")
      return b.vote_average - a.vote_average;
    if (sort.value === "vote_average.asc")
      return a.vote_average - b.vote_average;
    return 0;
  });
});

/* 초기화 */
function resetFilter() {
  keyword.value = "";
  genre.value = "";
  rating.value = "";
  sort.value = "";

  movies.value = [...baseMovies.value];
  page.value = Math.ceil(baseMovies.value.length / 20);
  isSearchMode.value = false;
}

/* 스크롤 */
function handleScroll() {
  showTop.value = window.scrollY > 300;

  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 300
  ) {
    isSearchMode.value ? loadSearch() : loadDiscover();
  }
}

function goTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<style scoped>
.search-page {
  padding: 10px 10px 60px;
  color: white;
}

.title {
  font-size: 28px;
  margin-bottom: 14px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-bar input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
}

.search-bar button {
  padding: 12px 20px;
  background: #e50914;
  border: none;
  border-radius: 8px;
  color: white;
}

.recent {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.recent span {
  background: #333;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-top: 18px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filters select {
  padding: 10px;
  border-radius: 6px;
  background: #222;
  color: white;
  border: none;
}

.reset-btn {
  margin-left: auto;
  padding: 10px 14px;
  background: #444;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* 🔥 핵심: 6열 고정 */
.movie-grid {
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 48px;
}


/* 🔥 TOP 버튼 복구 */
.top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  padding: 12px 16px;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  z-index: 9999;
}

/* 🔄 로딩 애니메이션 */
.loading-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 40px 0 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #e50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
.loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #aaa;
  letter-spacing: 1px;
}



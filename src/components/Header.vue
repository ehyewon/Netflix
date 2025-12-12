<template>
  <header class="header">
    <div class="left-group">
      <div class="logo" @click="goHome">🍿 Netflix Clone</div>

      <nav class="nav">
        <RouterLink to="/">홈</RouterLink>
        <RouterLink to="/popular">인기</RouterLink>
        <RouterLink to="/search">검색</RouterLink>
        <RouterLink to="/wishlist">찜목록</RouterLink>
      </nav>
    </div>

    <!-- ⭐ 로그인 상태 -->
    <div v-if="auth.isLogin" class="user-box">
      <span class="welcome">{{ auth.email }}님, 환영합니다.</span>

      <button class="logout" @click="logoutHandler">로그아웃</button>
    </div>

    <!-- ⭐ 로그아웃 상태 -->
    <div v-else class="login-btn" @click="goSignIn">
      👤
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth.js";

const router = useRouter();
const { auth, logout } = useAuth();   // ⭐ 전역 반응형 로그인 상태

// 이동 함수
function goHome() {
  router.push("/");
}

function goSignIn() {
  router.push("/signin");
}

// 로그아웃 처리
function logoutHandler() {
  logout();           // ⭐ 전역 상태 초기화
  router.push("/signin");
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;

  display: flex;
  align-items: center;
  padding: 0 32px;

  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(8px);

  z-index: 999;
}

/* 왼쪽 묶음: 로고 + 메뉴 */
.left-group {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
}

.nav {
  display: flex;
  gap: 24px;
}

a {
  color: #eee;
  text-decoration: none;
  font-size: 16px;
}

a.router-link-active {
  font-weight: bold;
  color: white;
}

/* 로그인 버튼 */
.login-btn {
  margin-left: auto;
  font-size: 26px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  transition: 0.2s;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 로그인 상태 박스 */
.user-box {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.welcome {
  font-size: 14px;
  color: #ddd;
}

.logout {
  padding: 6px 12px;
  background: #e50914;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.logout:hover {
  background: #f6121d;
}
</style>

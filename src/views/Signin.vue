<template>
  <div class="auth-wrapper">
    <div class="card-stack">

      <!-- 로그인 카드 -->
      <div v-if="!showSignup" class="auth-card login-card">
        <h2>로그인</h2>

        <input v-model="loginId" placeholder="아이디(이메일)" />
        <input v-model="loginPw" type="password" placeholder="비밀번호" />

        <label class="check-row">
          <input type="checkbox" v-model="saveId" />
          아이디 저장 (자동 로그인)
        </label>

        <button class="main-btn" @click="handleLogin">로그인</button>

        <p class="switch">
          계정이 없으신가요?
          <span @click="toggle">회원가입</span>
        </p>
      </div>

      <!-- 회원가입 카드 -->
      <div v-else class="auth-card signup-card">
        <h2>회원가입</h2>

        <input v-model="signId" placeholder="아이디(이메일)" />
        <input v-model="signPw" type="password" placeholder="비밀번호" />
        <input v-model="signPw2" type="password" placeholder="비밀번호 확인" />

        <label class="check-row">
          <input type="checkbox" v-model="agree" />
          약관에 동의하십니까? (필수)
        </label>

        <button class="main-btn" @click="handleSignup">회원가입</button>

        <p class="switch">
          이미 계정이 있으신가요?
          <span @click="toggle">로그인</span>
        </p>
      </div>
    </div>

    <!-- 성공 메시지 -->
    <div v-if="successMsg" class="success-popup">
      {{ successMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "@/composables/useToast.js";
import { useAuth } from "@/composables/useAuth.js";

const router = useRouter();
const { showToast } = useToast();
const { login } = useAuth();

/* 상태 */
const showSignup = ref(false);
const successMsg = ref("");

const loginId = ref("");
const loginPw = ref("");
const saveId = ref(false);

const signId = ref("");
const signPw = ref("");
const signPw2 = ref("");
const agree = ref(false);

/* 이메일 검사 */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* 🔥 자동 로그인 처리 (페이지 진입 시) */
onMounted(() => {
  const savedId = localStorage.getItem("savedId");
  const autoLogin = localStorage.getItem("autoLogin");
  const accounts = JSON.parse(localStorage.getItem("accounts") || "{}");

  if (savedId) {
    loginId.value = savedId;
    saveId.value = true;
  }

  // ✅ 브라우저 재시작 시 자동 로그인
  if (savedId && autoLogin === "true" && accounts[savedId]) {
    login(savedId, true);
    router.push("/");
  }
});

/* 카드 전환 */
const toggle = () => {
  successMsg.value = "";
  showSignup.value = !showSignup.value;
};

/* ---------------- 회원가입 ---------------- */
async function handleSignup() {
  if (!signId.value || !signPw.value || !signPw2.value) {
    showToast("모든 항목을 입력해주세요.");
    return;
  }

  if (!isValidEmail(signId.value)) {
    showToast("이메일 형식이 올바르지 않습니다.");
    return;
  }

  if (signPw.value !== signPw2.value) {
    showToast("비밀번호가 일치하지 않습니다.");
    return;
  }

  if (!agree.value) {
    showToast("필수 약관에 동의해야 합니다.");
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts") || "{}");

  if (accounts[signId.value]) {
    showToast("이미 존재하는 계정입니다.");
    return;
  }

  /* TMDB 인증 */
  try {
    await axios.get("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
      }
    });
  } catch {
    showToast("인증 서버 오류");
    return;
  }

  accounts[signId.value] = { password: signPw.value };
  localStorage.setItem("accounts", JSON.stringify(accounts));

  successMsg.value = "🎉 회원가입 완료!";
  setTimeout(() => {
    successMsg.value = "";
    showSignup.value = false;
  }, 1200);
}

/* ---------------- 로그인 ---------------- */
async function handleLogin() {
  if (!loginId.value || !loginPw.value) {
    showToast("아이디와 비밀번호를 입력해주세요.");
    return;
  }

  if (!isValidEmail(loginId.value)) {
    showToast("이메일 형식이 올바르지 않습니다.");
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts") || "{}");
  const account = accounts[loginId.value];

  if (!account || account.password !== loginPw.value) {
    showToast("아이디 또는 비밀번호가 일치하지 않습니다.");
    return;
  }

  /* TMDB 인증 */
  try {
    await axios.get("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
      }
    });
  } catch {
    showToast("인증 서버 오류");
    return;
  }

  // ✅ 핵심: auto 여부를 login에 전달
  login(loginId.value, saveId.value);

  successMsg.value = "🎉 로그인 성공!";
  setTimeout(() => {
    successMsg.value = "";
    router.push("/");
  }, 1000);
}
</script>

<style scoped>
.auth-wrapper {
  width: 100%;
  height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #141414;
}

.card-stack {
  width: 480px;
}

.auth-card {
  padding: 40px;
  background: #1e1e1e;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

input {
  padding: 14px;
  border-radius: 8px;
  border: none;
  background: #2a2a2a;
  color: white;
}

.check-row {
  font-size: 14px;
  color: #ccc;
}

.main-btn {
  padding: 14px;
  background: #e50914;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.switch {
  font-size: 14px;
  color: #bbb;
}

.switch span {
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.success-popup {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: #e50914;
  padding: 18px 28px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>

<template>
  <div class="auth-wrapper">
    <div class="card-stack">
      <transition name="card-slide" mode="out-in">
        <!-- 로그인 카드 -->
        <div v-if="!showSignup" key="login" class="auth-card login-card">
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
        <div v-else key="signup" class="auth-card signup-card">
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
      </transition>
    </div>

    <div v-if="successMsg" class="success-popup">
      {{ successMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "@/composables/useToast.js";
import { useAuth } from "@/composables/useAuth.js";

const router = useRouter();
const { showToast } = useToast();
const { login } = useAuth();

/* ===============================
   상태
================================ */
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

/* ===============================
   🔥 자동 로그인 + 아이디 채우기
================================ */
onMounted(() => {
  const savedId = localStorage.getItem("savedId");
  const autoLogin = localStorage.getItem("autoLogin");
  const accounts = JSON.parse(localStorage.getItem("accounts") || "{}");

  // 아이디 저장되어 있으면 input 채움
  if (savedId) {
    loginId.value = savedId;
    saveId.value = true;
  }

  // 자동 로그인
  if (savedId && autoLogin === "true" && accounts[savedId]) {
    login(savedId);
    router.push("/");
  }
});

/* ===============================
   🔥 아이디 저장 즉시 반영
================================ */
watch(saveId, (checked) => {
  const savedId = localStorage.getItem("savedId");

  if (checked) {
    // 체크했을 때 → 현재 입력된 아이디 저장
    if (loginId.value) {
      localStorage.setItem("savedId", loginId.value);
    }
  } else {
    // ❗중요: 지금 입력된 아이디가 savedId일 때만 삭제
    if (savedId === loginId.value) {
      localStorage.removeItem("savedId");
      localStorage.removeItem("autoLogin");
    }
  }
});


/* 카드 전환 */
const toggle = () => {
  successMsg.value = "";
  showSignup.value = !showSignup.value;
};

/* ===============================
   회원가입
================================ */
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

  try {
    await axios.get("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      },
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

/* ===============================
   로그인
================================ */
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

  try {
    await axios.get("https://api.themoviedb.org/3/movie/popular", {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
      },
    });
  } catch {
    showToast("인증 서버 오류");
    return;
  }

// 🔑 로그인 상태 저장
login(loginId.value);

// 🔥 아이디 저장 / 자동 로그인 처리 (수정)
if (saveId.value) {
  // 체크한 경우 → 현재 이메일을 저장
  localStorage.setItem("savedId", loginId.value);
  localStorage.setItem("autoLogin", "true");
} else {
  // ❗중요: 현재 로그인한 이메일이 savedId일 때만 제거
  const savedId = localStorage.getItem("savedId");

  if (savedId === loginId.value) {
    localStorage.removeItem("savedId");
    localStorage.removeItem("autoLogin");
  }
}


  successMsg.value = "🎉 로그인 성공!";
  setTimeout(() => {
    successMsg.value = "";
    router.push("/");
  }, 500);
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
  perspective: 1200px;
}

.auth-card {
  padding: 40px;
  background: #1e1e1e;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.card-slide-enter-active,
.card-slide-leave-active {
  transition: all 0.6s ease;
}

.card-slide-enter-from {
  opacity: 0;
  transform: translateX(80px) rotateY(-25deg);
}

.card-slide-leave-to {
  opacity: 0;
  transform: translateX(-80px) rotateY(25deg);
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

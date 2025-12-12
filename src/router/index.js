import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Signin from "@/views/Signin.vue";
import Popular from "@/views/Popular.vue";
import Search from "@/views/Search.vue";
import Wishlist from "@/views/Wishlist.vue";

const router = createRouter({
    // 🔑 핵심: Vite base 경로를 자동으로 반영
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
            meta: { requiresAuth: true }, // 🔒 로그인 필요
        },
        {
            path: "/popular",
            name: "Popular",
            component: Popular,
            meta: { requiresAuth: true },
        },
        {
            path: "/search",
            name: "Search",
            component: Search,
            meta: { requiresAuth: true },
        },
        {
            path: "/wishlist",
            name: "Wishlist",
            component: Wishlist,
            meta: { requiresAuth: true },
        },
        {
            path: "/signin",
            name: "Signin",
            component: Signin,
        },
    ],
});

/* ===============================
   🔐 로그인 라우팅 가드
================================ */
router.beforeEach((to, from, next) => {
    const isLogin = localStorage.getItem("isLogin") === "true";

    // 로그인 필요한 페이지인데 로그인 안돼있으면
    if (to.meta.requiresAuth && !isLogin) {
        next({ path: "/signin" });
    }
    // 로그인 상태인데 signin 접근하면 홈으로
    else if (to.path === "/signin" && isLogin) {
        next({ path: "/" });
    }
    else {
        next();
    }
});

export default router;

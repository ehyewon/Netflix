import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Signin from "@/views/Signin.vue";
import Popular from "@/views/Popular.vue";
import Search from "@/views/Search.vue";
import Wishlist from "@/views/Wishlist.vue";

const router = createRouter({
    // 🔥 GitHub Pages에서 SPA 새로고침/직접접근까지 모두 안정
    history: createWebHashHistory(),
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

    // 로그인 필요한 페이지인데 로그인 안돼있으면 → 로그인 페이지
    if (to.meta.requiresAuth && !isLogin) {
        next({ path: "/signin" });
    }
    // 로그인 상태인데 signin 접근하면 → 홈
    else if (to.path === "/signin" && isLogin) {
        next({ path: "/" });
    }
    else {
        next();
    }
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Signin from "@/views/Signin.vue";
import Popular from "@/views/Popular.vue";
import Search from "@/views/Search.vue";
import Wishlist from "@/views/Wishlist.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
            meta: { requiresAuth: true } // 🔒 로그인 필요
        },
        {
            path: "/popular",
            component: Popular,
            meta: { requiresAuth: true }
        },
        {
            path: "/search",
            component: Search,
            meta: { requiresAuth: true }
        },
        {
            path: "/wishlist",
            component: Wishlist,
            meta: { requiresAuth: true }
        },
        {
            path: "/signin",
            component: Signin
        }
    ]
});

/* ===============================
   🔐 로그인 미들웨어 (라우팅 가드)
================================ */
router.beforeEach((to, from, next) => {
    const isLogin = localStorage.getItem("isLogin") === "true";

    // 로그인 필요한 페이지인데 로그인 안돼있으면
    if (to.meta.requiresAuth && !isLogin) {
        next("/signin");
    }
    // 로그인 상태인데 signin 접근하면 홈으로
    else if (to.path === "/signin" && isLogin) {
        next("/");
    }
    else {
        next();
    }
});

export default router;

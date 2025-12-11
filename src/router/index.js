import { createRouter, createWebHistory } from 'vue-router';

// 페이지 컴포넌트 가져오기 (아직 파일은 안 만들었지만 구조만 만들어둠)
import HomePage from '../pages/HomePage.vue';
import PopularPage from '../pages/PopularPage.vue';
import SearchPage from '../pages/SearchPage.vue';
import WishlistPage from '../pages/WishlistPage.vue';
import LoginPage from '../pages/LoginPage.vue';

const routes = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/popular', name: 'popular', component: PopularPage },
    { path: '/search', name: 'search', component: SearchPage },
    { path: '/wishlist', name: 'wishlist', component: WishlistPage },
    { path: '/login', name: 'login', component: LoginPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

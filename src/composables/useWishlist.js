import { ref, watch } from "vue";
import { useAuth } from "@/composables/useAuth.js";

// ⭐ 계정별 찜목록 훅
export function useWishlist() {
    const { auth } = useAuth();

    // ⭐ 계정별 스토리지 key 생성 함수
    const getKey = () => {
        return auth.email
            ? `wishlist_${auth.email}`      // 로그인된 계정용
            : "wishlist_guest";             // 비회원(로그아웃 상태)
    };

    // ⭐ 로컬스토리지 → 반응형 상태 로드
    const wishlist = ref(loadWishlist());

    function loadWishlist() {
        const data = localStorage.getItem(getKey());
        return data ? JSON.parse(data) : [];
    }

    // ⭐ 계정 바뀌면(로그인/로그아웃) 자동으로 찜목록 다시 로드
    watch(
        () => auth.email,
        () => {
            wishlist.value = loadWishlist();
        }
    );

    // 찜 여부 확인
    const isWishlisted = (id) => {
        return wishlist.value.some((m) => m.id === id);
    };

    // 찜 토글 (추가 / 제거)
    const toggleWishlist = (movie) => {
        const idx = wishlist.value.findIndex((m) => m.id === movie.id);

        if (idx === -1) {
            wishlist.value.push(movie);
        } else {
            wishlist.value.splice(idx, 1);
        }

        // ⭐ 계정별 key로 저장
        localStorage.setItem(getKey(), JSON.stringify(wishlist.value));
    };

    const getWishlist = () => wishlist.value;

    return {
        wishlist,
        getWishlist,
        toggleWishlist,
        isWishlisted
    };
}

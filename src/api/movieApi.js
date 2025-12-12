import axios from "axios";

const API_KEY = "b4303f4fca2d461848894c447fbf6a72";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * 인기 영화 가져오기
 */
export async function getPopular(page = 1) {
    const res = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
            api_key: API_KEY,
            language: "ko-KR",
            page
        },
    });
    return res.data.results;
}

/**
 * 액션 영화 가져오기
 */
export async function getAction(page = 1) {
    const res = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
            api_key: API_KEY,
            with_genres: 28,
            language: "ko-KR",
            page
        },
    });
    return res.data.results;
}

/**
 * 높은 평점 영화 가져오기
 */
export async function getTopRated(page = 1) {
    const res = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
            api_key: API_KEY,
            language: "ko-KR",
            page
        },
    });
    return res.data.results;
}

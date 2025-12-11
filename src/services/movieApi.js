const API_KEY = "b4303f4fca2d461848894c447fbf6a72";
const BASE_URL = "https://api.themoviedb.org/3";

export const movieApi = {
    getPopularMoviesURL(page = 1) {
        return `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=${page}`;
    },

    getMoviesByGenreURL(genreId) {
        return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}`;
    },

    async fetchFeaturedMovie() {
        const res = await fetch(this.getPopularMoviesURL());
        const data = await res.json();
        return data.results[0];
    }
};

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { URLService } from '../../util/movie/URL';

@Component({
    selector: 'app-movie-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {

    movie: any = null;

    constructor(
        private route: ActivatedRoute,
        private urlService: URLService
    ) { }

    async ngOnInit() {
        const movieId = this.route.snapshot.paramMap.get('id');
        if (movieId) {
            this.movie = await this.urlService.getMovieDetail(Number(movieId));
        }
    }

    getImage(path: string) {
        return `https://image.tmdb.org/t/p/original${path}`;
    }
}

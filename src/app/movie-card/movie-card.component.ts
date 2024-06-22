import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }

  //After the component is mounted this will be called
  ngOnInit(): void {
    console.log(this.getMovies());
  }
  
  getMovies(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (response: any) => {
          // Assign movies to the component property
          this.movies = response;
          console.log('Movies fetched successfully:', response); // For debugging
        },
        error: (error: any) => {
          console.error('Error fetching movies:', error);
        },
      });
  }
}

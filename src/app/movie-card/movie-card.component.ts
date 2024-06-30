import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  favoriteMovies: any[] = [];
  userData = {Username: '', FavoriteMovies: []};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  //After the component is mounted this will be called
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }   
  
  getMovies(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (response: any) => {
          // Assign movies to the component property
          this.movies = response;
          // console.log('Movies fetched successfully:', response);
        },
        error: (error: any) => this.showError('Error fetching movies:'),
      });
  }

  /**
   * Fetches the user's favorite movies from the database and 
      stores them in the component.
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (movies: any) => {
        this.favoriteMovies = movies.filter((movie: { _id: any; }) => this.user.FavoriteMovies?.includes(movie._id));
      }
    });
  }/**
   * @param movie Adds a movie to the user's favorites and updates the list.
   */
  addToFavorites(movie: any): void {
    this.fetchApiData.addToFavorites(movie._id).subscribe({
      next: (response: any) => {
        localStorage.setItem('user', JSON.stringify(response));
        console.log('After adding a movie: ', JSON.stringify(response));
        this.snackBar.open('Movie successfully added to your favorites.', 'OK',{
          duration: 2000,
        });
      },
      error: (error: any) => {
        this.showError('Error adding movie to favorites.');
        console.error('Error:', error);
      },
    });
  }

  /**
   * 
   * @param movie Removes the specified movie from the user's 
   * favorite movies list and updates the list.
   */
  removeFromFavorites(movie: any): void {
    this.fetchApiData.deleteFromFavoriteMovies(movie)
      .subscribe({
        next: (response: any) => {
          console.log('After removing a movie: ', JSON.stringify(response));
          this.snackBar.open('Movie successfully removed from your favorites.', 'OK', {
            duration: 2000,
          });
        },
        error: (error: any) => {
          this.showError('Error removing movie from favorites.');
          console.error('Error:', error);
        },
      });
  }

  /**
   * 
   * @param movie Returns true if movie's ID exists in favorites list, 
   * indicating it's a favorite.
   * @returns 
   */
  isFavorite(movie: any): any {
    const movieId = movie._id;
    return this.favoriteMovies.some(movie => movie._id === movieId);
  }

  /**
   * 
   * @param movie Checks if movie's a favorite, 
   * then adds or removes it from favorites list.
   */
  toggleFavorite(movie: any): void {
    this.isFavorite(movie)
      ? this.removeFromFavorites(movie)
      : this.addToFavorites(movie);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Error', { duration: 2000 });
  }
}

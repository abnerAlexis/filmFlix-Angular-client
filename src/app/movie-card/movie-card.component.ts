import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favMov: string[] = [];  // we need this to prevent the warning in the next line.
  user = {Username: '', FavoriteMovies: this.favMov};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  //After the component is mounted this will be called
  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }  
  
  getMovies(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (response: any) => {
          this.movies = response;
        },
        error: (err: any) => this.showError(`Error fetching movies. Error: ${JSON.stringify(err)}`),
      });
  }

  getFavorites(): void {
    this.fetchApiData.getUser().subscribe({
      next: (response: any) => {
        this.user.FavoriteMovies = response.FavoriteMovies;
      }
    })
  }

  // fetchUser() {
  //   const username = localStorage.getItem('user') || '{}';
  //   this.fetchApiData.getUser().subscribe({
  //     next: (response: any) => {
  //       console.log(`fetchUser.response: ${JSON.stringify(response)}`)
  //       this.user.Username = response.Username;
  //       this.user.FavoriteMovies = response.FavoriteMovies;
  //       localStorage.setItem('user', response);
  //     }
  //   });
  // }
  

 /**
   * @param movie Adds a movie to the user's favorites and updates the list.
   */
 addToFavorites(movieId: string): void {
  this.fetchApiData.addToFavorites(movieId)
    .subscribe({
      next: (response: any) => {
        this.user.FavoriteMovies.push(movieId)
        this.snackBar.open('Movie successfully added to your favorites.', 'OK', {
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
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFromFavoriteMovies(movieId)
      .subscribe({
        next: (response: any) => {
          let indexNum = this.user.FavoriteMovies.indexOf(movieId)
          this.user.FavoriteMovies.splice(indexNum, 1); // remove the element
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
   * @param movieId Returns true if movie's ID exists in favorites list, 
   * indicating it's a favorite.
   * @returns 
   */
  isFavorite(title: string): boolean {
    return this.user.FavoriteMovies.includes(title);
  }

  /**
   * 
   * @param movie Checks if movie's a favorite, 
   * then adds or removes it from favorites list.
   */
  toggleFavorite(movieId: string): void {
    this.isFavorite(movieId)
      ? this.removeFromFavorites(movieId)
      : this.addToFavorites(movieId);
      console.log('isFavorite: ' + this.isFavorite(movieId));
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Error', { duration: 2000 });
  }

  openMovieInfoDialog(type: string, movie: any): void {
    this.dialog.open(MovieInfoComponent, {
      width: '500px',
      data: {type: type, movie: movie}
    });
  }
}

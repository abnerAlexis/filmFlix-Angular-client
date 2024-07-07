import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  favoriteMovieIds: any[] = [];
  favoriteMovies: any[] = [];
  @Input() user: any = { Username: '', Password: '', Email: '', Birthday: '', FavoriteMovies: this.favoriteMovies };
  movies: any[] = [];
  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
  ) {
    // If no valid token, navigate to welcome page
    if (!localStorage.getItem('token')) {
      this.showError('Invalid token. Please log in.');
      this.router.navigate(['welcome']);
    }
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.getMovies();
    this.getFavorites();
  }

  /**
   * 
   * @returns username from the localStorage 
   * for placeholder in the form
   */
  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  /**
   * 
   * @returns user's email
   * for placeholder in the form
   */
  getEmail(): string {
    return this.user.Email;
  }

  getBirthday(): string {
    return this.user.Birthday;
  }

  /**
   *  Retrieving user data from the API and populating the local user data object 
  */
  getUserProfile(): void {
    if (localStorage.getItem('username')) {
      this.fetchApiData.getUser().subscribe({
        next: (response) => {
          this.user.Username = response.Username;
          this.user.Email = response.Email;
          this.user.Birthday = response.Birthday;
          this.user.FavoriteMovies = response.FavoriteMovies;
        },
        error: (error) => this.showError(error.message),
        // complete: () => console.log(JSON.stringify(this.user))
      });
    } else {
      this.router.navigate(['login']);
    }
  }
  /**
   *Updates user information by calling an API endpoint (editUser) and 
   stores the updated data in local storage.
   */
  editUserInfo(): void {
    this.fetchApiData.editUser(this.user).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User update successful', 'OK', {
          duration: 2000
        });
      },
      error: (error) => this.showError('Error editing user information.'),
    })
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.fetchApiData.deleteUser().subscribe({
        next: () => {
          localStorage.removeItem('user');
          this.snackBar.open('Account deleted successfully.', 'OK', { duration: 2000 });
          this.router.navigate(['login']);
        },
        error: (error) => this.showError('Error deleting account: ' + error.message),
      });
    }
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies()
      .subscribe({
        next: (response: any) => {
          this.movies = response;
          // console.log(`Inside getMovies(): ${JSON.stringify(this.movies)}`);
        },
        error: (err: any) => this.showError(`Error fetching movies. Error: ${JSON.stringify(err)}`),
      });
  }

  /**
   * Retrieving all movies from the API and filtering them to identify the user's favorite movies
   * based on the movies' IDs included in the user.favoriteMovies array.
   */
  getFavorites(): void {
    this.fetchApiData.getUser().subscribe({
      next: (response: any) => {
        this.favoriteMovieIds = response.FavoriteMovies;
        // console.log(`getFavorites(): ${JSON.stringify(this.favoriteMovieIds)}`);
        this.getFavoriteMovies()
      }
    })
  }

  getFavoriteMovies(): void {
    this.favoriteMovies = this.movies.filter(movie => this.favoriteMovieIds.includes(movie._id));
  }

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
          this.getFavorites();
        },
        error: (error: any) => {
          this.showError('Error removing movie from favorites.');
          console.error('Error:', error);
        },
      });
  }

  backToMovie(): void {
    this.router.navigate(['movies']);
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

  openMovieInfoDialog(type: string, movie: any): void {
    this.dialog.open(MovieInfoComponent, {
      width: '500px',
      data: { type: type, movie: movie }
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Error', { duration: 2000 });
  }
}

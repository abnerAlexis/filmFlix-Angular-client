import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  
  @Input() userData: any = { Username: '', Password: '', Email: '', Birthday: '', FavoriteMovies: [] };
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    // If no valid token, navigate to welcome page
    if (!localStorage.getItem('token')) {
      this.showError('Invalid token. Please log in.');
      this.router.navigate(['welcome']);
    }
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.getFavoriteMovies();
  }

  /**
   *  Retrieving user data from an API and populating the local user data object 
  */
  getUserProfile(): void {
    if (localStorage.getItem('username')) {
      this.fetchApiData.getUser().subscribe({
        next: (response) => {
          this.userData.Username = response.Username;
          this.userData.Email = response.Email;
          this.userData.Birthday = response.Birthday;
          this.userData.FavoriteMovies = response.FavoriteMovies;
        },
        error: (error) => this.showError(error.message),
        complete: () => console.log(JSON.stringify(this.userData))
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
    this.fetchApiData.editUser(this.userData).subscribe({
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
          // Account deleted successfully
          localStorage.removeItem('user');
          this.snackBar.open('Account deleted successfully.', 'OK', { duration: 2000 });
          this.router.navigate(['login']);
        },
        error: (error) => this.showError('Error deleting account: ' + error.message),
      });
    }
  }
  
  //  addFavoriteMovie(movieId: string): void {
  //   this.fetchApiData.addToFavorites(movieId).subscribe({
  //     next: (response: any) => {
  //       this.favoriteMovies.push(response); 
  //       console.log('New Favorite Movie: ', response);
  //     },
  //     error: (error) => this.showError('Error adding the movie to favorites.')
  //   });
  // }
   
  /**
   * Retrieving all movies from the API and filtering them to identify the user's favorite movies
   * based on the movies' IDs included in the userData.favoriteMovies array.
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (moviesData) => {
        this.favoriteMovies = moviesData.filter((movie: any) => 
          this.userData.FavoriteMovies.includes(movie._id)
        );
      },
      error: (error: any) => this.showError('Failed loading favorite movies.'),
    });
  }

  removeFavoriteMovie(movieId: string): void {
    this.fetchApiData.deleteFromFavoriteMovies(movieId).subscribe({
      next: () => {
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
        console.log('Movie removed from favorites successfully');
      },
      error: (error: any) => {
        this.showError(error.message);
      }
    });
  }


  // toggleFavorite(movieId: string): any {
  //   if (this.isFavorite(movieId) === true) {
  //   this.removeFavoriteMovie(movieId);
  //   } else {
  //   this.addFavoriteMovie(movieId);
  //   }
  // }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.some(movie => movie._id === movieId);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Error', { duration: 2000 });
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(["welcome"]);
  }
}

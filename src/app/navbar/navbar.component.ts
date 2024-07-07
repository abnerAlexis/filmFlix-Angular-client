import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  user: any = { Username: '',Email: ''};

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router,
  ){}
  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    if (localStorage.getItem('username')) {
      this.fetchApiData.getUser().subscribe({
        next: (response) => {
          this.user.Username = response.Username;
          this.user.Email = response.Email;
        },
        error: (err) => this.showError(err.message)
      });
    } else {
      this.router.navigate(['login']);
    }
  }

  navigateToMovies() {
    this.router.navigate(['movies']);
  }

  navigateToProfile() {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(["welcome"]);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Error', { duration: 2000 });
  }
}

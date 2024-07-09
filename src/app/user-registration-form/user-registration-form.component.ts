import { Component, OnInit, Input } from '@angular/core'; // src/app/user-registration-form/user-registration-form.component.ts
import { MatDialogRef } from '@angular/material/dialog'; //Closes the dialog on success
import { FetchApiDataService } from '../fetch-api-data.service'; //API calls in fetch-api-data
import { MatSnackBar } from '@angular/material/snack-bar'; //Displays notifications back to the user
import { Router } from '@angular/router';

//Component(defining component) and Input(defining component's input/userdata) are decorators.
@Component({
  selector: 'app-user-registration-form', //Defines the custom HTML element <app-user-registration-form></app-user-registration-form>
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss',
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() user = { Username: '', Password: '', Email: '', Birthday: '', FavoriteMovies: [] };

  constructor(
    private fetchApiData: FetchApiDataService,
    private dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  registerUser(): void {
    this.fetchApiData.userRegistration(this.user).subscribe({
      next: (response) => {
        this.snackBar.open('Registration successful!', 'OK', {
          duration: 2000
        });

        const loginData = {
          Username: this.user.Username,
          Password: this.user.Password,
        };
        console.log('Login credentials:', loginData);
        this.dialogRef.close(); // This will close the modal on success
        this.loginUser(loginData);
      },
      error: (err) => {
        console.log(JSON.stringify(err));
        this.snackBar.open(err, 'OK', {
          duration: 2000
        });
      },
    });
  }

  loginUser(loginData: any): void {
        this.fetchApiData.userLogin(loginData).subscribe({
      next: (response) => {
        console.log(`LoginData: ${JSON.stringify(loginData)}`)
        localStorage.setItem('username', response.user.Username);
        localStorage.setItem('token', response.token);
        this.snackBar.open('Login successful!', 'OK', {
          duration: 2000
        });

        this.router.navigate(['movies'])
        this.dialogRef.close();
      },
      error: (err) => {
        console.log('Error: ' + err);
        this.snackBar.open(err, 'OK', {
          duration: 2000
        });
      },
    });
  }
}
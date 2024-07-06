import { Component, OnInit, Input } from '@angular/core'; // src/app/user-registration-form/user-registration-form.component.ts
import { MatDialogRef } from '@angular/material/dialog'; //Closes the dialog on success
import { FetchApiDataService } from '../fetch-api-data.service'; //API calls in fetch-api-data
import { MatSnackBar } from '@angular/material/snack-bar'; //Displays notifications back to the user
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form', //Defines the custom HTML element <app-user-login-form></app-user-login-form>
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit{

  @Input() userData = { Username: '', Password: ''};

  constructor(
    private fetchApiData: FetchApiDataService,
    private dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}
  
  ngOnInit(): void {}
    
  loginUser(): void {
    const loginData = {
      Username: this.userData.Username,
      Password: this.userData.Password
    }
    this.fetchApiData.userLogin(loginData).subscribe({
      next: (response) => {
        // localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('username', response.user.Username);
        localStorage.setItem('token', response.token);
        // console.log('Response: ' + JSON.stringify(response));
        this.snackBar.open('Login successful!', 'OK', {
          duration: 2000
        });

        this.router.navigate(['movies'])
        this.dialogRef.close(); // This will close the modal on success
      },
      error: (error) => {
        console.log('Error: ' + error);
        this.snackBar.open(error, 'OK', {
          duration: 2000
        });
      },
    });
  }
}
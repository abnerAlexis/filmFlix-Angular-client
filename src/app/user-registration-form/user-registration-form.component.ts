import { Component, OnInit, Input } from '@angular/core'; // src/app/user-registration-form/user-registration-form.component.ts
import { MatDialogRef } from '@angular/material/dialog'; //Closes the dialog on success
import { FetchApiDataService } from '../fetch-api-data.service'; //API calls in fetch-api-data
import { MatSnackBar } from '@angular/material/snack-bar'; //Displays notifications back to the user

@Component({
  selector: 'app-user-registration-form', //Defines the custom HTML element <app-user-registration-form></app-user-registration-form>
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData)
      .subscribe({
        next: (response) => {
          console.log('Response: ' + response);
          //TODO - successful registration logic
          this.dialogRef.close();
          // this.snackBar.open('Registration Successful!', 'OK', {
          this.snackBar.open(response, 'OK', {
            duration: 2000
          });
        },
        error: (error) => {
          this.snackBar.open(error.message || error, 'Error', {
            duration: 2000
          });
        },
      })
  }
}
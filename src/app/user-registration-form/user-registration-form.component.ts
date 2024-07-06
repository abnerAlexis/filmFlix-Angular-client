import { Component, OnInit, Input } from '@angular/core'; // src/app/user-registration-form/user-registration-form.component.ts
import { MatDialogRef } from '@angular/material/dialog'; //Closes the dialog on success
import { FetchApiDataService } from '../fetch-api-data.service'; //API calls in fetch-api-data
import { MatSnackBar } from '@angular/material/snack-bar'; //Displays notifications back to the user

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
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  registerUser(): void {
    this.fetchApiData.userRegistration(this.user).subscribe({
      next: (response) => {
        this.snackBar.open('Registration successful!', 'OK', {
          duration: 2000
        });
        this.dialogRef.close(); // This will close the modal on success
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open(error, 'OK', {
          duration: 2000
        });
      },
    });
  }
}
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.scss'
})
export class MovieInfoComponent implements OnInit {
  movieInfo: any;

  constructor(
    private dialogRef: MatDialogRef<MovieInfoComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
    this.getMovieInformation();
  }
  getMovieInformation(): void {
    switch (this.data.type) {
      case 'Genre':
        if (this.data.movie && this.data.movie.Genre) {
          this.movieInfo = this.data.movie;
          // console.log('Genre:', this.movieInfo.Genre);
        } else {
          this.showError('Genre information unavailable.');
        }
        break;

      case 'Director':
        // console.log('Director-data:', this.data.movie.Director);//Director name

        if (this.data.movie && this.data.movie.Director) {
          this.movieInfo = this.data.movie.Director;
          // console.log('Director-movieInfo:', this.movieInfo);
        } else {
          this.showError('Failed while fetching director info.');
        }
        break;

      case 'Synopsis':
        if (this.data.movie && this.data.movie.Description) {
          this.movieInfo = this.data.movie;
          // console.log('Synopsis:', this.movieInfo.Description);
        } else {
          this.showError('Synopsis information unavailable.');
        }
        break;

      default:
    }
  }

  clickClose(): void {
    this.dialogRef.close();
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Error', { duration: 2000 });
  }
}

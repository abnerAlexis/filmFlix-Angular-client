import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url, token and user that will provide data for the client app

const apiUrl = 'https://film-flix-3b34b5f2dccd.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  /**
   * userRegistration
  userDetails: any : Observable<any>*/
  public userRegistration(userDetails: any): Observable<any> {
    console.log('User Details: ' + JSON.stringify(userDetails));
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(loginData: any): Observable<any> {
    return this.http.post(apiUrl + 'login', loginData).pipe(
      catchError(this.handleError)
    );
  }

  //get movies " /movies "
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private extractResponseData(res: any): any {
    const body = res.json();
    return body || {};
  }

  //get movie by title  /movies/:Title
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //get director by movie title    "/movies/directorname/:Title"
  getDirector(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + '/movies/directorname/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //get genre by movie title "/movies/genre/"
  getGenre(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + '/movies/genre/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //get a user
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    return user;
  }

  //get favorite movies of a user
  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(map(this.extractResponseData),
      catchError(this.handleError))
  }

  //add a movie to favorite movies list   "/users/:Username/movies/:movieid"
  addToFavorites(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movie._id, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //edit user "/users/update/:Username"
  editUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/update/' + userDetails.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //delete useer "/users/:Username"
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //delete a favorite movie    /users/:Username/movies/:movieid"
  deleteFromFavoriteMovies(movie: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movie._id, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(() => ('Something bad happened. Try again later.'));
  }
}
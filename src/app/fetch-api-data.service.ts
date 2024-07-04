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
  /**
   * 
   * @param http Inject the HttpClient module to the constructor params
  This will provide HttpClient to the entire class, making it available via this.http
   */
  constructor(private http: HttpClient) { }

  // Making the api call for the user registration endpoint
  /**
   * userRegistration
  user: any : Observable<any>*/
  public userRegistration(user: any): Observable<any> {
    return this.http.post(apiUrl + 'users', user)
    .pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(loginData: any): Observable<any> {
    return this.http.post(apiUrl + 'login', loginData)
    .pipe(
      catchError(this.handleError)
    );
  }

  getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', this.getHeaders())
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getOneMovie(title: string): Observable<any> {
    return this.http.get(apiUrl + 'movies/' + title, this.getHeaders())
  .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getDirector(title: string): Observable<any> {
    return this.http.get(apiUrl + 'movies/director/' + title, this.getHeaders())
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getGenre(title: string): Observable<any> {
    return this.http.get(apiUrl + 'movies/genre/' + title, this.getHeaders())
    .pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  getUser(): Observable<any> {
    return this.http.get(apiUrl + 'users/' + this.getUsername(), this.getHeaders())
    .pipe(map(this.extractResponseData),
      catchError(this.handleError))
  }

  /**
   * @param movieId add a movie to favorite movies list
   */
  addToFavorites(movieId: string): Observable<any> {
    return this.http.post(
      `${apiUrl}users/${this.getUsername()}/movies/${movieId}`, '', this.getHeaders()
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @param username edit user
   * @returns response
   */
  editUser(user: any): Observable<any> {
    return this.http.put(
      apiUrl + 'users/update/' + this.getUsername(), user, this.getHeaders()
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  deleteUser(): Observable<any> {
    return this.http.delete(
      apiUrl + 'users/' + this.getUsername(), this.getHeaders()
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //delete a favorite movie
  deleteFromFavoriteMovies(movieId: string): Observable<any> {
    return this.http.delete(
      apiUrl + 'users/' + this.getUsername() + '/movies/' + movieId, this.getHeaders()
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private extractResponseData(res: Object): any {
    return res || {};
  }

  private handleError(err: HttpErrorResponse): any {
    if (err.error instanceof ErrorEvent) {
      console.error('Some error occurred:', err.error.message);
    } else {
      console.log(`Error Status code ${err.status}`);
      console.log(`Error body is: ${err}`);
    }
    return throwError(() => ('Something bad happened. Try again later.'));
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + localStorage.getItem('token') }
    )};
  }

  private getUsername() {
    return localStorage.getItem('username') || 'invalidUsername'
  }
}
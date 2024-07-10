# [FilmFlix Angular Client](https://abneralexis.github.io/filmFlix-Angular-client)

![FilmFlix](image.png)

This project was generated with Angular CLI version 18.0.4 and uses Node.js version 18.20.2.

## Features

### Welcome Page
Provides login and signup options.  
**Signup:** Enables new users to register by entering their username, password, email, and birthday.  
**Login:** Requires a username and password. 

### Movies Page
After a successful login or signup, users can see the listed movies with their images. They can view the genre, director, and synopsis by clicking the respective buttons.

### Profile Page  
Allows users
- to update information, including username, password, email, and date of birth.
- to view their favorite movies.
- to add or remove movies from the list of favorites.
- to delete their accounts from the platform.

### Technologies

- **Database:** MongoDB Atlas for cloud-based database storage.
- **Authentication:** JWT for user authentication.
- **Backend:** Node.js with Express for server-side development, MongoDB for database management.
- **Frontend:** Angular web application framework, Angular Material for UI components, RxJS for composing asynchronous and event-based programs.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running the Project Locally
```
ng serve --open
```
### Deploying to gh-pages
1. **Verify Remote Repository Configuration:**

   Ensure you have a remote repository set up on GitHub for your Angular project. Check if your local Git repository is linked to the remote repository by running:
   
This command should list your configured remotes. If you don't see a remote listed, add one using:

```
git remote add origin <your_github_repo_url>
```


2. **Add angular-cli-ghpages:**

Add `angular-cli-ghpages` to your project by running:

```
ng add angular-cli-ghpages
```

3. **Specify Remote Repository URL (Optional):**

If you don't want to configure a named remote or haven't set one up yet, you can directly specify the remote repository URL in the `ng deploy` command using the `--repo` option:

In the main branch:

```
ng deploy --base-href=/filmFlix-Angular-client/ --repo <your_github_repo_url>
```

Example:

```
ng deploy --base-href=/filmFlix-Angular-client/ --repo https://github.com/abnerAlexis/filmFlix-Angular-client.git
```


**Note:** Make sure you update `allowedOrigins` in the API project to avoid CORS issues.


4. Double-Check Base URL:
Make sure the --base-href option you are using matches the URL structure of your GitHub Pages deployment.

### Additional Tips:
* <strong>Ensure you're running ```ng deploy``` from the root directory of your Angular project.</strong>

Check if you have the latest version of the Angular CLI installed. You can update it using:
```
npm update -g @angular/cli
```
**Note:** the official Angular documentation for deployment to GitHub Pages: https://www.makeuseof.com/angular-app-github-deploy-using-angular-cli/

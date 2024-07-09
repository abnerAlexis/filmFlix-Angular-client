### Running the Project Locally
```
ng serve --open
```
### Deploying to gh-pages
1. Verify Remote Repository Configuration:

Make sure you have a remote repository set up on GitHub for your Angular project.
Check if your local Git repository is linked to the remote repository. You can verify this by running:

```
git remote -v
```
This command should list your configured remotes. If you don't see a remote listed, you'll need to add one using:
```
git remote add origin <your_github_repo_url>
```
Add angular-cli-ghpages by running
````
 ng add angular-cli-ghpages
 ```
2. Specify Remote Repository URL (Optional):

If you don't want to configure a named remote or haven't set one up yet, you can directly specify the remote repository URL in the ng deploy command using the ```--repo``` option:
```
ng deploy --base-href=/filmFlix-Angular-client/ --repo <your_github_repo_url>

ng deploy --base-href=/filmFlix-Angular-client/ --repo https://github.com/abnerAlexis/filmFlix-Angular-client.git
```
3. Double-Check Base URL:
Make sure the --base-href option you are using matches the URL structure of your GitHub Pages deployment.

### Additional Tips:
* <strong>Ensure you're running ```ng deploy``` from the root directory of your Angular project.</strong>

Check if you have the latest version of the Angular CLI installed. You can update it using:
```
npm update -g @angular/cli
```
* the official Angular documentation for deployment to GitHub Pages: https://www.makeuseof.com/angular-app-github-deploy-using-angular-cli/
import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable(
  {  providedIn: 'root'}
)
export class AuthService {
  token: string;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  errorMessage;
  currentUserEmail;
  private tokenTimer: any;

  constructor(private router: Router) {}


  signupUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res) => console.log(res))
      .catch(
        error => {
          this.errorMessage = error.message;
        }
      );
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => {
                this.token = token;
                if (token) {

                  this.isAuthenticated = true;
                  this.currentUserEmail = firebase.auth().currentUser.email;
                  this.authStatusListener.next(true);
                  const now = new Date();
                  const expirationDate = new Date(
                    now.getTime() + 3600 * 1000
                  );
                  // console.log(expirationDate);
                  this.saveAuthData(this.token, this.currentUserEmail, expirationDate);

                  this.router.navigate(['/main-blog-page/posts']);
                }
              }
            );
        }
      )
      .catch(
        error => {
            this.errorMessage = error.message;
          }
      );
  }

  getCurrentUserEmail() {
    return this.currentUserEmail;
  }
  getToken() {
    return this.getAuthData().token;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.isAuthenticated = true;
      this.token = authInformation.token;
      this.currentUserEmail = authInformation.email;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  //login time in browser
  private setAuthTimer(duration: number) {
    console.log('setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.onLogout();
    }, duration * 1000);
  }

  //save authdata  in localstorage for use in component
  private saveAuthData(token: string, email: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const expirationDate = localStorage.getItem('expiration');
    if (!token) {
      return;
    }
    return {
      token: token,
      email: email,
      expirationDate: new Date(expirationDate),
    };
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    // console.log(this.isAuthenticated);
    return this.isAuthenticated;
  }



  onLogout() {
    firebase.auth().signOut();
    this.token = null;
    this.currentUserEmail = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['main-blog-page']);
  }

}

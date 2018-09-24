import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  currentUserEmail: string;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    console.log(this.authService.getCurrentUserEmail());

    this.currentUserEmail = this.authService.getCurrentUserEmail();
  }



  goToSignInPage() {
    this.router.navigate(['/sign-in']);
  }

  goToSignUpPage() {
    this.router.navigate(['/sign-up']);
  }
  goToPostCreatePage() {
    this.router.navigate(['main-blog-page/post-create']);
  }
  onLogout() {
    this.authService.onLogout();
  }
  goToMainPage() {
    return this.router.navigate(['main-blog-page']);
  }
  goToPostPage() {
    return this.router.navigate(['main-blog-page/posts']);
  }
}

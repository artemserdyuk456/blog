import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  errorMessage;


  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });


  }
  goToMainPage() {
    return this.router.navigate(['main-blog-page'])
  }

  errrorSet() {
    if (this.authService.errorMessage) {
      this.errorMessage = this.authService.errorMessage;
      return true;
    } else {
      return false;
    }
  }

  onSignIn() {
    this.authService.signinUser(
      this.signInForm.value.email,
      this.signInForm.value.password
    );
  }

}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  errorMessage;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }
  goToMainPage() {
    return this.router.navigate(['main-blog-page']);
  }

  onSignUp() {
    this.authService.signupUser(
      this.signUpForm.value.email,
      this.signUpForm.value.password
    );
  }

  errrorSet() {
    if (this.authService.errorMessage) {
      this.errorMessage = this.authService.errorMessage;
      return true;
    } else {
      return false;
    }
  }


}

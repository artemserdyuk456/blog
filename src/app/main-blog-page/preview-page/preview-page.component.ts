import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.css']
})
export class PreviewPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToSignUpPage() {
    this.router.navigate(['/sign-up']);
  }

}

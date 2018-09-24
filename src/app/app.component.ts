import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private authService: AuthService) {}

  ngOnInit() {
    firebase.initializeApp({
      firebase: {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
      }
    });

    this.authService.autoAuthUser();
  }
}

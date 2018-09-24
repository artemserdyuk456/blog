import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {ErrorInterceptor} from './error-interceptor';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule, MatProgressBarModule
} from '@angular/material';
import {ModalModule, RatingModule} from 'ngx-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import {HeaderComponent} from './main-blog-page/header/header.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MainBlogPageComponent } from './main-blog-page/main-blog-page.component';
import { PreviewPageComponent } from './main-blog-page/preview-page/preview-page.component';
import { FooterComponent } from './main-blog-page/footer/footer.component';
import { PostCreateComponent } from './main-blog-page/post-create/post-create.component';
import { PostListComponent } from './main-blog-page/post-list/post-list.component';
import {environment} from '../environments/environment';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    MainBlogPageComponent,
    PreviewPageComponent,
    FooterComponent,
    PostCreateComponent,
    PostListComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressBarModule,
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth-guard.service';

import {MainBlogPageComponent} from './main-blog-page/main-blog-page.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {PreviewPageComponent} from './main-blog-page/preview-page/preview-page.component';
import {PostCreateComponent} from './main-blog-page/post-create/post-create.component';
import {PostListComponent} from './main-blog-page/post-list/post-list.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/main-blog-page', pathMatch: 'full'},
  { path: 'main-blog-page', component: MainBlogPageComponent, children: [
      { path: '', component: PreviewPageComponent },
      { path: 'post-create', component: PostCreateComponent, canActivate: [AuthGuard]},
      { path: 'posts', component: PostListComponent, canActivate: [AuthGuard]},
    ]},
  { path: 'sign-in', component: SignInComponent},
  { path: 'sign-up', component: SignUpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}

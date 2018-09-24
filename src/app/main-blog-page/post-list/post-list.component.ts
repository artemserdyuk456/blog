import {Component, OnDestroy, OnInit} from '@angular/core';
import {Comment, Post} from '../../blog.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {BlogService} from '../../blog.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,  OnDestroy {
  commentForm: FormGroup;

  //for posts
  postUser: Post[] = [];
  private postsSub: Subscription;

  //fo auth
  private  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  currentUserEmail: string;

  //for comments
  commentsUsers: Comment[] = [];
  private commentsSub: Subscription;

  //for rating
  rating = new FormControl(null, Validators.required);
  currentPostId;
  ratingPostId = [];
  ratingsCount = [];
  ratingData = [];
  totalCount = 0;
  individualPostArray = [];
  length = [];
  actualRating;



  constructor(private blogService: BlogService,
              private authService: AuthService) { }

  ngOnInit() {
    this.commentForm = new FormGroup({
      comment: new FormControl(null, Validators.required )
    });


    this.blogService.getPost();
    this.postsSub = this.blogService.getPostUpdateListener()
      .subscribe((postData: Post[]) => {
          this.postUser = postData;
        }
      );

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.currentUserEmail = this.authService.getCurrentUserEmail();

    this.blogService.getComments();

    this.commentsSub = this.blogService.getCommentUpdateListener()
      .subscribe((commentData: Comment[]) => {
          this.commentsUsers = commentData;
          this.ratingPost(commentData);
        }
      );

  }


  addComment(id: string) {
    if (this.commentForm.valid && this.rating.valid) {
      this.blogService.createComment(
        this.currentUserEmail,
        this.commentForm.value.comment,
        id,
        this.rating.value
      );
    }
  }


  ratingPost(commentData) {
    this.individualPostArray = [];
    this.ratingPostId = [];
    this.ratingsCount = [];
    this.ratingData = [];
    this.length = [];
    this.totalCount = 0;
    let finishArr;


    this.postUser.forEach(post => {
      commentData.forEach(elem => {
        if (post.id === elem.postId) {
          let obj = {
              postId: post.id,
              rating: elem.rating
          };
          this.ratingPostId.push(obj);

          let countRating = 0;
          this.length = [
            {
              postId: post.id,
              length: 0
            }
          ];

          let leng;
          for (let i = 0; i < this.ratingPostId.length; i++) {

            if ( this.ratingPostId[i].postId === post.id) {
              ++countRating;
               leng = this.length.find( len => {
                  return obj.postId === post.id;
                }
              );
              leng.length = countRating;
            }

          }
          console.log(this.length);

          finishArr = {
            rating: 0,
            postId: post.id,
            length: countRating
          };
          this.individualPostArray.push(finishArr);


          console.log(this.ratingPostId);
          // console.log(this.currentPostId);

          let count = 0;
          for (const key of this.ratingPostId) {
            // console.log(key.postId);

            if (key.postId === post.id) {
              // console.log(key.rating);
              if (key.rating === '5') {
                count += key.rating * 5;
              } else if (key === '4') {
                count += key.rating * 4;
              } else if (key === '3') {
                count += key.rating * 3;
              } else if (key === '2') {
                count += key.rating * 2;
              } else {
                count += key.rating;
              }
              const found = this.individualPostArray.find( obj => {
                  return obj.postId === post.id;
                }
              );
              found.rating = count;
            }
          }
          for (let i = 0; i < this.individualPostArray.length; i++) {
            if ( this.individualPostArray[i].rating === 0) {
              this.individualPostArray.splice(i, 1);
              break;
            }
          }
        }
      });

      // function not completed.........................

    });





    console.log(this.individualPostArray);

  }
  //version all averade rating for all posts

  // ratingPost(commentData) {
  //   this.ratingPostId = [];
  //   this.ratingsCount = [];
  //   this.ratingData = [];
  //   this.totalCount = 0;
  //
  //   this.postUser.forEach(post => {
  //     commentData.forEach(elem => {
  //       if (post.id === elem.postId) {
  //         let obj = {
  //           postId: post.id,
  //           rating: elem.rating
  //         };
  //         this.ratingPostId.push(obj);
  //         console.log(this.ratingPostId);
  //         console.log(obj);
  //
  //         if (this.ratingsCount[elem.rating]) {
  //           this.ratingsCount[elem.rating] += 1;
  //         } else {
  //           this.ratingsCount[elem.rating] = 1;
  //         }
  //       }
  //     });
  //   });
  //
  //
  //
  //   for (let key in this.ratingsCount) {
  //     let data = {
  //       name: key,
  //       value: this.ratingsCount[key]
  //     };
  //     this.ratingData.push(data);
  //   }
  //
  //   for (const key in this.ratingsCount) {
  //     if (key === '5') {
  //       this.totalCount += this.ratingsCount[key] * 5;
  //     } else if (key === '4') {
  //       this.totalCount += this.ratingsCount[key] * 4;
  //     } else if (key === '3') {
  //       this.totalCount += this.ratingsCount[key] * 3;
  //     } else if (key === '2') {
  //       this.totalCount += this.ratingsCount[key] * 2;
  //     } else {
  //       this.totalCount += this.ratingsCount[key];
  //     }
  //   }
  //
  //   this.actualRating = (this.totalCount / commentData.length).toFixed(2);
  //
  // }

  accessToDeletePosts(email: string) {
    if ( this.userIsAuthenticated && email === this.currentUserEmail) {
      return true;
    }
  }
  showRating(postId: string) {
    this.individualPostArray.forEach(rating => {
      if (postId === rating.postId) {
        //setTimeout hide the  erro in

        setTimeout(() => this.actualRating = rating.rating, 0);
        // this.actualRating = rating.rating;


      }
    });
    return true;
  }
  commentsToPosts(postId: string, commentPostId: string) {
    if (postId === commentPostId) {
      return true;
    } else {
      return false;
    }
  }
  onDeleteComment(id: string, savePostId: string, commentId: string) {
    this.blogService.deleteComments(id, savePostId, commentId);
  }

  onDeletePost(id: string, imageName: string) {
    this.blogService.daletePost(id, imageName);
  }
  // avoid memory leaks
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
    this.commentsSub.unsubscribe();
  }
}

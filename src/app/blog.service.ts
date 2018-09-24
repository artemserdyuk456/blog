import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as firebase from 'firebase';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Comment, Post} from './blog.model';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Upload} from './upload.models';



@Injectable(
  {  providedIn: 'root'}
)
export class BlogService {
  //for our posts
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  //for our comments
  private comments: Comment[] = [];
  private commentsUpdated = new Subject<Comment[]>();
  private ratingData: any;


  constructor(private http: HttpClient,
              private authService: AuthService,
              private router: Router) {}


  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  imageUpload(upload: Upload, title: string, content: string, email: string,) {
    const basePath = '/images';
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${basePath}/${upload.file.name}` ).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // data for progress bar
        upload.progress = ( uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      },
      //error
      error => {
        console.log(error);
      },
      //success
      (): any => {
        uploadTask.snapshot.ref.getDownloadURL()
          .then(
            downloadUrl => {
              upload.url = downloadUrl;
              upload.name = upload.file.name;
              this.createPost(title, content, email, upload);
            }
          );
      }
    );
  }

  createPost(title: string, content: string, email: string, upload: Upload) {
    const token = this.authService.getToken();
    const postData: Post = {
      id: null,
      title: title,
      email: email,
      content: content,
      image: upload,
      comments: null,
    };
    this.http.post('https://blog-app-63b3c.firebaseio.com/posts.json?auth=' + token, postData)
      .subscribe(res => {
        const post: Post = {
          id: null,
          title: title,
          email: email,
          content: content,
          image: upload,
          comments: null
        };
        // console.log(post);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/main-blog-page/posts']);
      });
  }




  getPost() {
    const token = this.authService.getToken();
    this.http.get('https://blog-app-63b3c.firebaseio.com/posts.json?auth=' + token)
      .pipe(map(post => {
        const postData = [];
        for (const key in post) {
          if (post.hasOwnProperty(key)) {
            postData.push({...post[key], id: key});
          }
        }
        return postData;
      }))
      .subscribe(transformPost => {
        // console.log(transformPost);
       this.posts = transformPost;
       this.postsUpdated.next([...this.posts]);
      });
  }

  daletePost(postId: string, imageName: string) {
    //delete our post
    const token = this.authService.getToken();
    this.http.delete('https://blog-app-63b3c.firebaseio.com/posts/' + postId + '.json?auth=' + token)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });


    //delete our image in post
    const basePath = '/images';
    const storageRef = firebase.storage().ref();
    const desertRef = storageRef.child(`${basePath}/${imageName}`);
    desertRef.delete()
      .catch(
        error => console.log(error)
      );
  }

  getCommentUpdateListener() {
    return this.commentsUpdated.asObservable();
  }

  createComment(comEmail: string, text: string, postId: string, rating: number) {
    const token = this.authService.getToken();
    const commentData: Comment = {
      id: null,
      comEmail: comEmail,
      text: text,
      postId: postId,
      rating: rating
    };
    this.http.post('https://blog-app-63b3c.firebaseio.com/comments.json?auth=' + token, commentData)
      .subscribe(res => {
        const comment: Comment = {
          id: null,
          comEmail: comEmail,
          text: text,
          postId: postId,
          rating: rating
        };
        this.comments.push(comment);
        this.commentsUpdated.next([...this.comments]);
      });
  }

  getComments() {
    const token = this.authService.getToken();
    this.http.get('https://blog-app-63b3c.firebaseio.com/comments.json?auth=' + token)
      .pipe(map(comments => {
        const commentsData = [];
        for (const key in comments) {
          if (comments.hasOwnProperty(key)) {
            commentsData.push({...comments[key], id: key});
          }
        }
        return commentsData;
      }))
      .subscribe(transformPost => {
        // console.log(transformPost);
        this.ratingData = transformPost;
        this.comments = transformPost;
        this.commentsUpdated.next([...this.comments]);
      });
  }

  deleteComments(postId: string, savePostId: string, commentId: string) {
    const token = this.authService.getToken();
    if (postId === savePostId) {
      this.http.delete('https://blog-app-63b3c.firebaseio.com/comments/' + commentId + '.json?auth=' + token)
        .subscribe(() => {
          const updatedComments = this.comments.filter(post => post.id !== commentId);
          this.comments = updatedComments;
          this.commentsUpdated.next([...this.comments]);
        });
    }
  }


}

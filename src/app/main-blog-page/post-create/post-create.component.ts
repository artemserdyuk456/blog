import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {BlogService} from '../../blog.service';
import { mimeType } from './mime-type.validator';

import {AuthService} from '../../auth.service';
import {Upload} from '../../upload.models';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  currentUserEmail: string;
  imagePreview: string;
  progressBarValue;
  file;
  upload: Upload;



  constructor(private blogService: BlogService,
              private authService: AuthService) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      title: new FormControl(null, Validators.required ),
      content: new FormControl(null, Validators.required ),
      image: new FormControl(null,
        {
      validators: [Validators.required],
        asyncValidators: [mimeType]
        })
    });

    this.blogService.getPost();
    this.currentUserEmail = this.authService.getCurrentUserEmail();

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.file = file;
    this.upload = new Upload(file);

    this.postForm.patchValue({ image: file });
    this.postForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    if (this.postForm.valid) {
      this.blogService.imageUpload(
        this.upload,
        this.postForm.value.title,
        this.postForm.value.content,
        this.currentUserEmail
      );
    }
  }



}

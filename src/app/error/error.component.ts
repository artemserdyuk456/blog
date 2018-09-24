import {Component, Inject, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  modalRef: BsModalRef;

  constructor(@Inject(BsModalRef) public message: string) {}

  ngOnInit() {
  }

}

import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {ErrorComponent} from './error/error.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.dialog.open(ErrorComponent);
        let errorMessage = 'An unknown error occurred!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        const initialState = { message: errorMessage};
        this.modalRef = this.modalService.show(
          ErrorComponent,
          Object.assign({}, { class: 'gray modal-sm', initialState })
        );
        return throwError(error);
      })
    );
  }
}

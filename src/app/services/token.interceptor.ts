import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (this.authService.isTokenExpired()) {
  //     return this.authService.refreshToken().pipe(
  //       switchMap((newToken: string) => {
  //         localStorage.setItem('token', newToken);
  //         const clonedReq = this.addToken(req, newToken);
  //         return next.handle(clonedReq);
  //       }),
  //       catchError(error => {
  //         this.authService.logout();
  //         return throwError(error);
  //       })
  //     );
  //   }
  //   return next.handle(req);
  // }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
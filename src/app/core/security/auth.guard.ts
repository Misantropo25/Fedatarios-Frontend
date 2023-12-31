import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
      if (localStorage.getItem('token')) {
        // El usuario está autenticado
        return true;
      }
      // El usuario no está autenticado, redirigir a la página de login
      this.router.navigate(['/login']);
      return false;
    }
}
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
  export class AutoLogoutService {
    private timer: any;
  
    constructor(private authService: AuthService, private router: Router) {}
  
    // public startTimer() {
    //   const timeToLogout = 30 * 60 * 1000; // 30 minutos, por ejemplo
    //   if (this.timer) {
    //     clearTimeout(this.timer);
    //   }
    //   this.timer = setTimeout(() => this.authService.logout(), timeToLogout);
    // }
  
    // public resetTimer() {
    //   clearTimeout(this.timer);
    //   this.startTimer();
    // }
  }
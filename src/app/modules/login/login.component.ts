import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


  constructor( private router: Router){

  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');

  }

  acceder(){
    this.router.navigate(['/dashboard/perfil']);
    
  }

  user = {
    username: '',
    password: ''
  };

  showPassword: boolean = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Procesar inicio de sesión
    console.log(this.user);
  }

  
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  credentials = { dni: '', password: '' };
  loading: boolean = false;
  message: string = 'Credenciales incorrectas';
  showModal: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private modalService: ModalService
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.authService.login(this.credentials).subscribe(
      response => {
        this.loading = false;
        localStorage.setItem('token', response.jwt); // Asegúrate de que 'jwt' sea la clave correcta
        // localStorage.setItem('userId', response.userId);
        // localStorage.setItem('userDni', response.userDni);
        this.router.navigate(['/dashboard/perfil']); // Redirige al usuario
      },
      error => {
        this.loading = false;
        this.modalService.changeMessage(this.message);
        // this.errorMessage = 'Credenciales incorrectas';
        this.showModal = true;
        setTimeout(() => this.showModal = false, 1000); // Oculta el modal después de 1 segundos
      }
    );
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
  
}

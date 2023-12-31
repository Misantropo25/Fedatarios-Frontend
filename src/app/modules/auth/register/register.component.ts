import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { dni: '', password: '', nombre: '', apePaterno: '', apeMaterno: '', email: '', telefono: '' };

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.register(this.user).subscribe(
      response => console.log('Usuario registrado exitosamente', response),
      error => console.error('Error en el registro', error)
    );
  }
}

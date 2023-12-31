import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;
  fotoUrl!: string;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // Suponiendo que tienes una forma de obtener el ID del usuario actual (por ejemplo, desde el localStorage)
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.cargarPerfilUsuario(+userId);
    }
  }

  cargarPerfilUsuario(userId: number): void {
    this.usuarioService.getUsuario(userId).subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        this.fotoUrl = usuario.foto
          ? 'data:image/jpeg;base64,' + usuario.foto
          : 'assets/img/avatar5.png'; // Ruta de tu imagen por defecto
        // Realizar acciones con los datos del usuario
    } else {
        // Manejar el caso en que el usuario es null
        this.fotoUrl = 'assets/img/avatar2.png'; // Ruta de tu imagen por defecto
    }
    });
  }
}

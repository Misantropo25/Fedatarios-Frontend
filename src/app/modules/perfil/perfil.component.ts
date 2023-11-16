import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  dniUsuario: string = '70445736';
  telefonoUsuario: string = '983000123';
  nombreUsuario: string = 'Gonzalo Jair';
  apellidoPaternoUsuario: string = 'Almanza';
  apellidoMaternoUsuario: string = 'Cuno';
  correoUsuario: string = 'jair@hotmail.com';
  rolUsuario: string = 'Usuario';

  // constructor(private userService: UserService) { }  // Reemplaza 'UserService' con el nombre real de tu servicio

  ngOnInit(): void {
    // Llama al servicio para obtener la información del usuario
    // this.userService.obtenerInformacionUsuario().subscribe(
    //   (usuario) => {
    //     // Asigna los valores obtenidos del usuario a las variables del componente
    //     this.dniUsuario = usuario.dni;
    //     this.telefonoUsuario = usuario.telefono;
    //     this.nombreUsuario = usuario.nombre;
    //     this.apellidoPaternoUsuario = usuario.apellidoPaterno;
    //     this.apellidoMaternoUsuario = usuario.apellidoMaterno;
    //     this.correoUsuario = usuario.correo;
    //     this.rolUsuario = usuario.rol;
    //   },
    //   (error) => {
    //     console.error('Error al obtener la información del usuario', error);
    //     // Puedes manejar el error según tus necesidades
    //   }
    // );
  }
}

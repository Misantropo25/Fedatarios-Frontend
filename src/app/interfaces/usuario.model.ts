import { Rol } from "./rol.model";

export class Usuario {
  idusuario: number;
  idUsuario!: number;
  dni: string;
  apePaterno: string;
  apeMaterno: string;
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  fechaInicio: Date;
  foto: string;
  descripcionRol: string;
  rol: Rol; // Agregar esta propiedad si deseas almacenar todo el objeto rol

  constructor() {
    this.idusuario = 0;
    this.dni = '';
    this.apePaterno = '';
    this.apeMaterno = '';
    this.nombre = '';
    this.email = '';
    this.telefono = '';
    this.password = '';
    this.fechaInicio = new Date();
    this.foto='';
    this.rol = new Rol(); // Inicializar esta propiedad
    this.descripcionRol = '';
  }
}
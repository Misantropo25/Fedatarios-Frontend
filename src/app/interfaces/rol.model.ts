import { Usuario } from "./usuario.model";

// rol.model.ts
export class Rol {
    idrol: number;
    descripcion_rol: string;
    usuarios: Usuario[]; // Cambio aquí: ahora es un arreglo
    constructor() {
      this.idrol = 0;
      this.descripcion_rol = '';
      this.usuarios = []; // Inicializa como arreglo vacío
    }
  }
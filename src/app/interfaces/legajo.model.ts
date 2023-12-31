export class Legajo {
  idlegajo: number;
  fecha: Date;
  usuarioId: number; // ID del usuario que creó el legajo
  idFedatarioResponsable: number; // Nuevo campo para el ID del fedatario responsable

  constructor() {
    this.idlegajo = 0;
    this.fecha = new Date();
    this.usuarioId = 0;
    this.idFedatarioResponsable = 0; // Inicializa con un valor por defecto, como 0
  }
}
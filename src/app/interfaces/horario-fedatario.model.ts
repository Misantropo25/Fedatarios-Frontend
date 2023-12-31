// Clase para representar un usuario
export class Usuario {
  idUsuario!: number;
}

// Clase para representar un horario fedatario
export class HorarioFedatario {
  id!: number | null;
  diaSemana!: string;
  horaInicio!: string;
  horaFin!: string;
  fecha!: string;
  usuario!: Usuario; // Aquí incluyes la propiedad usuario
}
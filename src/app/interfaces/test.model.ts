export interface SeguimientoEvento {
    fecha: Date;
    titulo: string;
    descripcion: string;
    tipo: 'creado' | 'revisado' | 'firmado' | 'observado';
  }
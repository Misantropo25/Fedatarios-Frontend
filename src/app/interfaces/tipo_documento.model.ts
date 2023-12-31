export class TipoDocumento {
    idtipo_documento: number;
    tipoDocumentoId!: number;
    descripcion: string;
  
    constructor(descripcion: string = '') {
        this.idtipo_documento= 0
        this.descripcion = descripcion;
    }
  }
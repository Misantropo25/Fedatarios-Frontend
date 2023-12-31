export class DocumentoEscaneado {
  id!: number;
  iddoc_escaneado!: number;
  tipo_documento!: string;
  rutaArchivo!: string;
  rutaArchivoFirmado!: string;
  firmado!: boolean;
  estadoActual?: string; // Nueva propiedad para el estado del documento

    constructor(
      public tipoDocumentoId: number,
      public file: File | null,
      public idUsuarioPropietario: number
    ) {}
  }
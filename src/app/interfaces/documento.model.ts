export class Documento {
    id!: number;                       // Identificador del documento
    tipoDocumentoId!: number;          // Identificador del tipo de documento
    nombreTipoDocumento?: string;     // Nombre del tipo de documento
    firmado!: boolean;                 // Indica si el documento está firmado
    rutaArchivo!: string;              // Ruta al archivo del documento
    rutaArchivoFirmado?: string;      // Ruta al archivo firmado (opcional)
    legajoId?: number;                // Identificador del legajo (opcional)
    nombreUsuario?: string; // Agrega esta línea

    // Constructor para inicializar el modelo
    constructor(
        id: number = 0,
        tipoDocumentoId: number = 0,
        nombreTipoDocumento: string = '',
        firmado: boolean = false,
        rutaArchivo: string = '',
        rutaArchivoFirmado: string = '',
        legajoId: number = 0
    ) {
        this.id = id;
        this.tipoDocumentoId = tipoDocumentoId;
        this.nombreTipoDocumento = nombreTipoDocumento;
        this.firmado = firmado;
        this.rutaArchivo = rutaArchivo;
        this.rutaArchivoFirmado = rutaArchivoFirmado;
        this.legajoId = legajoId;
    }
}

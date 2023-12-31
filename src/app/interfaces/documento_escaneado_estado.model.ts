import { Estado } from "./estado.model";

export class DocumentoEscaneadoEstado {
    id: number;
    iddocEscaneado: number; // ID del documento escaneado
    idEstado: number; // ID del estado
    fechaCambio: string; // Fecha en formato string (ISO 8601)
    estado!: Estado;

    constructor(id: number, iddocEscaneado: number, idEstado: number, fechaCambio: string) {
        this.id = id;
        this.iddocEscaneado = iddocEscaneado;
        this.idEstado = idEstado;
        this.fechaCambio = fechaCambio;
    }
}
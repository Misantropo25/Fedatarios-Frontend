export class Observacion {
    idobservaciones: number;
    sugerencias: string;
    descripcion: string;

    constructor(idobservaciones: number, sugerencias: string, descripcion: string, ) {
        this.idobservaciones = idobservaciones;
        this.descripcion = descripcion;
        this.sugerencias = sugerencias;
    }
}
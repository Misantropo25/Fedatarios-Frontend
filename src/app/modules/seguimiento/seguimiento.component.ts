import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { DocumentoEscaneado } from 'src/app/interfaces/documento_escaneado.model';
import { SeguimientoEvento } from 'src/app/interfaces/test.model';
import { LegajoService } from '../../services/legajo.service';
import { DocumentosEscaneadosService } from '../../services/documento_escaneado.service';
import { Legajo } from 'src/app/interfaces/legajo.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ObservacionesService } from 'src/app/services/observaciones.service';
import { Observacion } from 'src/app/interfaces/observaciones.model';
import { DocumentoEscaneadoEstado } from 'src/app/interfaces/documento_escaneado_estado.model';
import { DocumentoEscaneadoEstadoService } from 'src/app/services/documento_estados.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css'],
})
export class SeguimientoComponent implements OnInit {
  //Declaracion de variables
  @ViewChild('modalSeguimiento') modalSeguimiento!: ElementRef;
  legajos: Legajo[] = [];
  legajoSeleccionado?: number;
  documentos: DocumentoEscaneado[] = [];
  documentoUrl!: SafeResourceUrl;
  observacionesDelDocumento: Observacion[] = [];
  estadosDocumento: DocumentoEscaneadoEstado[] = [];

  ngOnInit() {
    this.cargarLegajosUsuario();
  }
  //Declaracion del constructor
  constructor(
    private router: Router,
    private legajoService: LegajoService,
    private documentosEscaneadosService: DocumentosEscaneadosService,
    private sanitizer: DomSanitizer,
    private observacionesService: ObservacionesService,
    private documentoEscaneadoEstadoService: DocumentoEscaneadoEstadoService
  ) {}

  //Declaracion de metodos

  //Metodos de modal
  abrirModalSeguimiento(): void {
    const modalElement: HTMLElement = this.modalSeguimiento.nativeElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
  }

  // cerrarModalSeguimiento(): void {
  //   const modalElement: HTMLElement = this.modalSeguimiento.nativeElement;
  //   modalElement.style.display = 'none';
  //   modalElement.classList.remove('show');
  // }

  //Metodos de manejo de de info
  cargarLegajosUsuario(): void {
    const usuarioId = Number(localStorage.getItem('userId'));
    this.legajoService.getLegajosPorUsuarioId(usuarioId).subscribe({
      next: (legajos) => (this.legajos = legajos),
      error: (error) => console.error('Error al cargar legajos', error),
    });
  }

  cargarEstadosDelDocumento(idDocumento: number): void {
    this.documentoEscaneadoEstadoService.getEstadosPorDocumento(idDocumento).subscribe({
      next: (estados) => {
        this.estadosDocumento = estados;
        // Aquí puedes abrir el modal de seguimiento y mostrar los estados
      },
      error: (error) => console.error('Error al cargar estados del documento', error)
    });
  }

  cargarDocumentosPorLegajo(): void {
    if (!this.legajoSeleccionado) {
      this.documentos = [];
      return;
    }
    this.documentosEscaneadosService
      .buscarPorLegajoId(this.legajoSeleccionado)
      .subscribe({
        next: (documentos) => {
          this.documentos = documentos;
          // Implementa lógica adicional si es necesario, por ejemplo, asignar el nombre del tipo de documento, etc.
        },
        error: (error) => console.error('Error al cargar documentos', error),
      });
  }

  previsualizarDocumento(documento: any): void {
    this.documentoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.documentosEscaneadosService.getVisualizarUrl(documento.id)
    );
    $('#previsualizacionModal').modal('show');
  }

  verObservaciones(documento: DocumentoEscaneado): void {
    this.observacionesService
      .getObservacionesPorDocumentoId(documento.id)
      .subscribe({
        next: (observaciones) => {
          // Aquí manejas las observaciones, por ejemplo, almacenándolas en una variable
          // y mostrando un modal con los detalles
          this.observacionesDelDocumento = observaciones;
          $('#observacionesModal').modal('show');
        },
        error: (error) => console.error('Error al cargar observaciones', error),
      });
  }

  abrirModalSeguimientoConEstados(idDocumento: number): void {
    this.documentoEscaneadoEstadoService.getEstadosPorDocumento(idDocumento).subscribe({
      next: (estados) => {
        this.estadosDocumento = estados;
        this.abrirModalSeguimiento();
        // Aquí puedes abrir el modal o realizar otra acción
      },
      error: (error) => console.error('Error al cargar estados', error)
    });
  }

  obtenerClaseIcono(estado: DocumentoEscaneadoEstado): string {
    switch (estado.estado.descripcion) {
      case 'Observado': return 'fas fa-exclamation-circle';
      case 'Creado': return 'fas fa-file-alt';
      case 'Subsanado': return 'fas fa-tools';
      case 'Firmado': return 'fas fa-signature';
      default: return 'fas fa-file-alt'; // Ícono por defecto
    }
  }

  obtenerIcono(estado: string): string {
    switch (estado) {
      case 'Observado': return 'fas fa-exclamation-circle';
      case 'Creado': return 'fas fa-file-alt';
      case 'Subsanado': return 'fas fa-tools';
      case 'Firmado': return 'fas fa-signature';
      default: return 'fas fa-file-alt';
    }
  }

  obtenerEstilo(estado: string): any {
    switch (estado) {
      case 'Observado': return { 'border-color': '#ffc107' }; // Amarillo
      case 'Creado': return { 'border-color': '#28a745' }; // Verde
      case 'Subsanado': return { 'border-color': '#17a2b8' }; // Azul claro
      case 'Firmado': return { 'border-color': '#007bff' }; // Azul
      default: return {};
    }
  }


  cerrarModal(): void {
    $('#previsualizacionModal').modal('hide');
    $('#observacionesModal').modal('hide');
  }

  cerrarModalSeguimiento(): void {
    const modalElement: HTMLElement = this.modalSeguimiento.nativeElement;
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
    this.estadosDocumento = []; // Limpiar los estados para el próximo uso
  }
  //Codigo de prueba
  eventosSeguimiento: SeguimientoEvento[] = [
    {
      fecha: new Date(),
      titulo: 'Documento Creado',
      descripcion: 'El documento ha sido creado.',
      tipo: 'creado',
    },
    {
      fecha: new Date(),
      titulo: 'Documento Revisado',
      descripcion: 'El fedatario revisó el documento.',
      tipo: 'revisado',
    },
    {
      fecha: new Date(),
      titulo: 'Documento Firmado',
      descripcion: 'El documento ha sido firmado.',
      tipo: 'firmado',
    },
    // Más eventos de prueba...
  ];
}

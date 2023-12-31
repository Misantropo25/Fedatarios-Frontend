import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { DocumentosEscaneadosService } from 'src/app/services/documento_escaneado.service';
import { ObservacionesService } from 'src/app/services/observaciones.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observacion } from 'src/app/interfaces/observaciones.model';
import { TipoDocumentoService } from '../../services/tipo_documento.service';
import { Subscription, forkJoin, interval, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { TipoDocumento } from 'src/app/interfaces/tipo_documento.model';
import { DocumentoEscaneado } from 'src/app/interfaces/documento_escaneado.model';
import { Documento } from 'src/app/interfaces/documento.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario.model';
import { Legajo } from 'src/app/interfaces/legajo.model';
import { LegajoService } from '../../services/legajo.service';

//var $: any; // Si estás usando jQuery con Bootstrap
@Component({
  selector: 'app-firmar',
  templateUrl: './firmar.component.html',
  styleUrls: ['./firmar.component.css'],
})
export class FirmarComponent implements OnInit, OnDestroy {
  documentos: any[] = [];
  dniBusqueda: string = '';
  fecha: Date = new Date();
  fechaHoraActual!: string;
  private subscription!: Subscription;
  //documentoUrl: string = ''; prueba para descargar
  documentoUrl!: SafeResourceUrl;
  //Variables para manejo de observaciones
  observaciones: any[] = []; // Asumimos que esto se llena con las observaciones posibles
  observacionesSeleccionadas: number[] = []; // Array para guardar IDs seleccionados
  detalleObservacion: string = '';
  documentoActual: any; // El documento actual para el cual se están agregando observaciones
  observacionesActuales: Observacion[] = [];

  // ... Tus variables existentes ...
  usuarios: Usuario[] = []; // Asumiendo que tienes un modelo Usuario
  legajos: Legajo[] = []; // Lista de legajos
  idFedatario!: number;
  usuarioSeleccionado: number | null = null; // ID del usuario seleccionado
  legajoSeleccionado: number | null = null; // ID del legajo seleccionado

  constructor(
    private documentoService: DocumentosEscaneadosService,
    private observacionesService: ObservacionesService,
    private tipoDocumentoService: TipoDocumentoService,
    private usuarioService: UsuarioService,
    private legajoService: LegajoService,
    private sanitizer: DomSanitizer //Pa los docs
  ) {}

  ngOnInit(): void {
    this.cargarDocumentos();
    this.cargarTiposDeObservaciones();
    //Para la hora
    this.subscription = interval(1000).subscribe(() => {
      const ahora = new Date();
      this.fechaHoraActual = ahora.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false, // Cambiar a false para formato de 24 horas
      });
    });
    this.idFedatario = Number(localStorage.getItem('userId'));/* obtén el ID del fedatario actual */
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    // Es importante desuscribirse para evitar fugas de memoria
    this.subscription.unsubscribe();
  }

  //Carga de usuarios
  cargarUsuarios(): void {
    const idFedatario = Number(localStorage.getItem('userId'));
    this.usuarioService.getUsuariosPorFedatarioResponsable(idFedatario).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        // console.log("Usuarios cargados: ", this.usuarios);
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  cargarLegajos(): void {
    // console.log("Usuario seleccionado: ", this.usuarioSeleccionado);
    if (this.usuarioSeleccionado) {
      this.legajoService.getLegajosPorUsuarioId(this.usuarioSeleccionado)
        .subscribe({
          next: (legajos) => {
            this.legajos = legajos;
          },
          error: (err) => console.error('Error al cargar legajos', err)
        });
    } else {
      this.legajos = [];
    }
  }

  cargarDocumentosPorLegajo(): void {
    if (this.legajoSeleccionado) {
      this.documentoService.buscarPorLegajoId(this.legajoSeleccionado).subscribe({
        next: (documentosEscaneados) => {
          if (documentosEscaneados.length === 0) {
            this.documentos = [];
            return;
          }
  
          forkJoin(
            documentosEscaneados.map((documentoEscaneado) =>
              this.tipoDocumentoService
                .getTipoDocumento(documentoEscaneado.tipoDocumentoId)
                .pipe(
                  map((tipoDoc: TipoDocumento) => ({
                    ...documentoEscaneado,
                    nombreTipoDocumento: tipoDoc.descripcion
                    // Agregar más datos si es necesario
                  }))
                )
            )
          ).subscribe((documentosConTipo) => {
            this.documentos = documentosConTipo;
          });
        },
        error: (err) => console.error('Error al cargar documentos', err),
      });
    } else {
      this.documentos = [];
    }
  }

  cerrarModal(): void {
    $('#visualizarDocumentoModal').modal('hide');
    $('#observacionesModal').modal('hide');
  }

  cargarDocumentos2(): void {
    this.documentoService.getAllDocumentosEscaneados().subscribe((data) => {
      this.documentos = data;
    });
  }
  cargarDocumentos(): void {
    this.documentoService
      .getAllDocumentosEscaneados()
      .pipe(
        switchMap((documentosEscaneados: DocumentoEscaneado[]) => {
          if (documentosEscaneados.length === 0) {
            return of([]);
          }

          return forkJoin(
            documentosEscaneados.map((documentoEscaneado) =>
              this.tipoDocumentoService
                .getTipoDocumento(documentoEscaneado.tipoDocumentoId)
                .pipe(
                  map(
                    (tipoDoc: TipoDocumento) =>
                      ({
                        ...documentoEscaneado,
                        nombreTipoDocumento: tipoDoc.descripcion,
                      } as unknown as Documento)
                  ) // Aquí convertimos el objeto a tipo Documento
                )
            )
          );
        })
      )
      .subscribe((documentosConTipo: Documento[]) => {
        this.documentos = documentosConTipo;
      });
  }

  cargarTiposDeObservaciones(): void {
    this.observacionesService.getAllObservaciones().subscribe({
      next: (data) => {
        this.observaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar tipos de observaciones:', err);
      },
    });
  }

  iniciarObservacion(documento: any): void {
    this.documentoActual = documento;
    this.observacionesActuales = [
      {
        idobservaciones: 0, // Cambiar a null
        sugerencias: '',
        descripcion: '',
      },
    ];
    $('#observacionesModal').modal('show');
  }

  agregarNuevaObservacion(): void {
    const nuevaObservacion: Observacion = {
      idobservaciones: 0, // o el valor predeterminado
      sugerencias: '',
      descripcion: '',
      // vacío o valor predeterminado
    };
    this.observacionesActuales.push(nuevaObservacion);
  }

  registrarObservaciones(documento: any): void {
    if (
      this.observacionesActuales.some(
        (obs) => obs.idobservaciones === 0 || obs.sugerencias.trim() === ''
      )
    ) {
      alert('Por favor, completa todos los campos de las observaciones.');
      return;
    }
    this.observacionesService
      .agregarObservacionesADocumento(documento.id, this.observacionesActuales)
      .subscribe({
        next: () => {
          alert('Observaciones registradas con éxito');
          $('#observacionesModal').modal('hide');
          this.limpiarObservaciones();
          // Recargar los documentos si es necesario
          this.cargarDocumentos();
        },
        error: (err) => console.error('Error al registrar observaciones', err),
      });
  }

  limpiarObservaciones(): void {
    this.observacionesActuales = [];
  }

  buscarDocumento(): void {
    if (this.dniBusqueda) {
      this.documentoService.buscarPorDni(this.dniBusqueda).subscribe((data) => {
        this.documentos = data;
      });
    } else {
      this.cargarDocumentos();
    }
  }

  visualizar(documento: any): void {
    this.documentoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.documentoService.getVisualizarUrl(documento.id)
    );
    $('#visualizarDocumentoModal').modal('show');
  }
}

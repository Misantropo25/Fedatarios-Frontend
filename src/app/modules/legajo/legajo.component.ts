import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { DocumentosEscaneadosService } from '../../services/documento_escaneado.service';
import { DocumentoEscaneado } from '../../interfaces/documento_escaneado.model';
import { TipoDocumentoService } from '../../services/tipo_documento.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HorarioFedatarioService } from '../../services/horario-fedatario.service';
import { Usuario } from 'src/app/interfaces/usuario.model';
import { Rol } from '../../interfaces/rol.model';
import { RolService } from 'src/app/services/rol.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css'],
})
export class LegajoComponent implements OnInit, AfterViewInit {
  legajoForm!: FormGroup;
  tiposDocumento: any[] = [];
  fedatarios: any[] = []; // Asume que tienes una lista de fedatarios
  horarios: any[] = []; // Asume que tienes una lista de horarios disponibles
  usuario!: Usuario;
  userId!: number;

  idLegajoCreado!: number;

  @ViewChild('successModal') successModal!: ElementRef;

  //Declaracion jurada type
  @ViewChild('declarationModal') declarationModal!: ElementRef;
  isDeclarationAccepted: boolean = false;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(
    private fb: FormBuilder,
    private tipoDocumentoService: TipoDocumentoService,
    private fedatarioService: UsuarioService,
    private horarioFedatarioService: HorarioFedatarioService,
    private documentoService: DocumentosEscaneadosService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.legajoForm = this.fb.group({
      fedatarioId: [null, Validators.required],
      horarioId: [null, Validators.required],
      documentos: this.fb.array([]),
    });

    this.agregarDocumento(); // Agrega un documento inicialmente
    this.cargarTiposDocumento();
    this.cargarFedatarios();
    // this.cargarHorarios();
    this.userId = Number(localStorage.getItem('userId'));

    this.legajoForm
      .get('fedatarioId')!
      .valueChanges.subscribe((fedatarioId) => {
        if (fedatarioId) {
          this.cargarHorariosDelFedatario(fedatarioId);
        }
      });
  }

  ngAfterViewInit(): void {
    // Ahora el modal se muestra después de que la vista se haya inicializado completamente
    this.mostrarModalDeclaracion();
  }

  //Metodos de declaracion jurada
  mostrarModalDeclaracion() {
    const modalElement = this.declarationModal.nativeElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
  }

  ocultarModalDeclaracion() {
    const modalElement = this.declarationModal.nativeElement;
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
  }

  aceptarDeclaracion() {
    this.isDeclarationAccepted = true;
    this.ocultarModalDeclaracion();
  }

  cargarHorariosDelFedatario(fedatarioId: number) {
    this.horarioFedatarioService
      .getHorariosPorUsuarioId(fedatarioId)
      .subscribe((horarios) => {
        const ahora = new Date(); // Fecha y hora actuales

        this.horarios = horarios.filter((horario) => {
          const fechaHorario = new Date(
            horario.fecha + 'T' + horario.horaInicio
          ); // Combina la fecha y la hora de inicio

          return fechaHorario >= ahora; // Compara con la fecha y hora actuales
        });

        // Actualiza los eventos del calendario si es necesario
        this.actualizarEventosCalendario();
      });
  }

  actualizarEventosCalendario() {
    this.events = this.horarios.map((horario) => {
      const horaInicio = new Date(`${horario.fecha}T${horario.horaInicio}`);
      const horaFin = new Date(`${horario.fecha}T${horario.horaFin}`);

      return {
        title: `Horario registrado del ${'Fedator'}`, // Aquí deberías poner el nombre del usuario o fedatario
        start: horaInicio,
        end: horaFin,
        color: { primary: '#ad2121', secondary: '#FAE3E3' },
      };
    });
  }

  get documentos(): FormArray {
    return this.legajoForm.get('documentos') as FormArray;
  }

  cargarTiposDocumento() {
    this.tipoDocumentoService.getTiposDocumento().subscribe(
      (tipos) => {
        this.tiposDocumento = tipos;
      },
      (error) => {
        console.error('Error al cargar tipos de documento', error);
      }
    );
  }

  cargarFedatarios() {
    forkJoin({
      usuarios: this.fedatarioService.getUsuarios(),
      roles: this.rolService.getRoles(),
    }).subscribe(({ usuarios, roles }) => {
      this.fedatarios = usuarios
        .map((usuario) => ({
          ...usuario,
          rol:
            this.encontrarRolDeUsuario(usuario.idusuario, roles) || new Rol(),
        }))
        .filter((usuario) => usuario.rol.descripcion_rol === 'Fedator');
    });
  }

  encontrarRolDeUsuario(idUsuario: number, roles: Rol[]): Rol | undefined {
    for (const rol of roles) {
      if (rol.usuarios && rol.usuarios.some((u) => u.idusuario === idUsuario)) {
        return rol;
      }
    }
    return undefined;
  }

  cargarHorarios() {
    this.horarioFedatarioService.getHorariosFedatarios().subscribe(
      (horarios) => {
        this.horarios = horarios;
        //console.log(this.horarios);
        this.events = horarios.map((horario) => {
          const horaInicio = new Date(`${horario.fecha}T${horario.horaInicio}`);
          const horaFin = new Date(`${horario.fecha}T${horario.horaFin}`);
          const fecha = new Date(`${horario.fecha}T${horario.fecha}`);

          return {
            title: `Horario de ${'Usuario'}`, // Asumiendo que 'nombre' es una propiedad en el objeto 'usuario'
            start: horaInicio,
            end: horaFin,
            color: { primary: '#ad2121', secondary: '#FAE3E3' },
          };
        });
      },
      (error) => console.error('Error al cargar horarios', error)
    );
  }

  agregarDocumento() {
    const documentoGroup = this.fb.group({
      tipoDocumentoId: [null, Validators.required],
      archivo: [null, Validators.required],
    });

    this.documentos.push(documentoGroup);
  }

  eliminarDocumento(index: number) {
    this.documentos.removeAt(index);
  }

  validarArchivo(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length) {
      const file = input.files[0];
      if (file && file.type === 'application/pdf') {
        // El archivo es un PDF
        const documentoFormGroup = this.documentos.at(index) as FormGroup;
        documentoFormGroup.patchValue({ archivo: file });
      } else {
        // No es un PDF o no es válido
        alert('Por favor, suba un archivo PDF.');
        const documentoFormGroup = this.documentos.at(index) as FormGroup;
        documentoFormGroup.patchValue({ archivo: null });
      }
    }
  }

  subirDocumentos() {
    if (!this.isDeclarationAccepted) {
      alert('Por favor, acepta la declaración jurada antes de continuar.');
      return;
    }
    if (this.legajoForm.valid && this.todosLosDocumentosSonPDF()) {
      const documentosValidos = this.documentos.controls
        .map((control) => control.getRawValue())
        .filter((valor) => valor.archivo instanceof File)
        .map(
          (valor) =>
            new DocumentoEscaneado(
              valor.tipoDocumentoId,
              valor.archivo,
              this.userId
            )
        );

      if (documentosValidos.length > 0) {
        const idFedatarioResponsable =
          this.legajoForm.get('fedatarioId')?.value;
        this.documentoService
          .uploadDocumentos(
            documentosValidos,
            this.userId,
            idFedatarioResponsable
          )
          .subscribe({
            next: (response) => {
              console.log('Documentos cargados:', response);
              this.idLegajoCreado = Number(response.legajoId);
              this.mostrarModal();
              // Mostrar el modal cierta cantidad de tiempo quitado en los cambios c:
              // setTimeout(() => {
              //   this.ocultarModal();
              //   this.resetearFormulario();
              // }, 2000);
            },
            error: (error) => {
              console.error('Error al cargar documentos:', error);
              // Aquí puedes manejar errores específicos si es necesario
            },
          });
      } else {
        alert('No hay documentos válidos para cargar.');
      }
    } else {
      alert(
        'Por favor, completa todos los campos requeridos y asegúrate de que todos los archivos sean PDF'
      );
    }
  }

  resetearFormulario() {
    // Resetear el formulario aquí
    this.legajoForm.reset();
    this.documentos.clear();
    this.agregarDocumento(); // Agrega un documento inicialmente
  }

  todosLosDocumentosSonPDF(): boolean {
    return this.documentos.controls.every((documento: AbstractControl) => {
      const archivo: File = documento.get('archivo')?.value;
      return archivo?.type === 'application/pdf';
    });
  }

  //uso de modales
  // Mostrar el modal
  mostrarModal() {
    const modalElement = this.successModal.nativeElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
  }

  ocultarModal() {
    const modalElement = this.successModal.nativeElement;
    this.resetearFormulario();
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
  }
}

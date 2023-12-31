import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HorarioFedatarioService } from 'src/app/services/horario-fedatario.service';
import {
  HorarioFedatario,
  Usuario,
} from 'src/app/interfaces/horario-fedatario.model';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
})
export class HorariosComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  modalRef?: BsModalRef;
  selectedEvent?: CalendarEvent;
  horariosFedatarios: HorarioFedatario[] = [];
  fecha!: string; // Formato 'yyyy-MM-dd'
  selectedHorario?: HorarioFedatario;
  crearHorarioForm!: FormGroup;
  editarHorarioForm!: FormGroup;
  idUsuarioEnSesion!: number;
  CalendarView = CalendarView;

  refresh = new Subject<void>();

  modalData!: {
    event: CalendarEvent | HorarioFedatario | null;
    isNew: boolean;
  };
  horarioForm!: FormGroup;

  formattedDate: string = '';

  @ViewChild('eventModal') eventModal!: TemplateRef<any>;
  @ViewChild('modalCrearHorario') modalCrearHorario!: TemplateRef<any>;
  @ViewChild('modalEditarHorario') modalEditarHorario!: TemplateRef<any>;
  @ViewChild('successModal') successModal!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private horarioService: HorarioFedatarioService
  ) {}

  ngOnInit(): void {
    // this.loadHorarios();
    this.crearHorarioForm = this.fb.group({
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      fecha: ['', Validators.required],
    });
    this.editarHorarioForm = this.fb.group({
      diaSemana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      fecha: ['', Validators.required], // Asegúrate de agregar esto
    });
    this.editarHorarioForm.get('fecha')?.valueChanges.subscribe((fecha) => {
      if (fecha) {
        const fechaLocal = new Date(fecha + 'T00:00:00'); // Asegura que la fecha se interpreta en la zona horaria local
        const diaSemana = this.getDayOfWeek(fechaLocal);
        this.editarHorarioForm
          .get('diaSemana')
          ?.setValue(diaSemana, { emitEvent: false });
      }
    });

    // Agregar suscripción a cambios en la fecha para el formulario de creación
    this.crearHorarioForm.get('fecha')?.valueChanges.subscribe((fecha) => {
      if (fecha) {
        const partes = fecha.split('-');
        const año = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript empiezan en 0
        const dia = parseInt(partes[2], 10);

        // Usa la hora local para evitar problemas de zona horaria
        const fechaLocal = new Date(año, mes, dia);
        const diaSemana = this.getDayOfWeek(fechaLocal);
        this.crearHorarioForm.get('diaSemana')?.setValue(diaSemana);
      }
    });
    this.cargarHorarios();
    this.updateFormattedDate();
    this.loadHorarios();
    this.horarioForm.get('fecha')?.valueChanges.subscribe(() => {
      this.actualizarDiaSemana();
    });
    this.recargarHorarios();
    this.modalData = { event: null, isNew: true }; // Valor inicial
  }

  loadHorarios() {
    this.idUsuarioEnSesion = Number(localStorage.getItem('userId'));
    this.horarioService
      .getHorariosPorUsuarioId(this.idUsuarioEnSesion)
      .subscribe((horarios) => {
        this.horariosFedatarios = horarios;
        this.events = horarios.map((horario) =>
          this.convertToCalendarEvent(horario)
        );
      });
  }

  abrirModalCreacion(): void {
    this.modalData = { event: null, isNew: true };
    this.crearHorarioForm.reset();
    this.modalRef = this.modalService.show(this.modalCrearHorario);
  }

  abrirModalEdicion(horario: HorarioFedatario) {
    console.log('Horario a editar:', horario); // Depuración
    this.modalData = { event: horario, isNew: false };
    this.selectedHorario = horario;
    this.editarHorarioForm.patchValue(horario);
    this.modalRef = this.modalService.show(this.modalEditarHorario);
  }

  crearHorario(): void {
    console.log(this.crearHorarioForm); // Debugging
    if (this.crearHorarioForm.valid) {
      const horario = this.prepararHorario(this.crearHorarioForm.value);
      this.horarioService.createHorarioFedatario(horario).subscribe(() => {
        this.recargarHorarios();
        this.modalRef?.hide();
      });
    } else {
      console.log('Formulario no válido', this.crearHorarioForm.errors);
    }
  }

  editarHorario() {
    console.log('Valores del formulario:', this.editarHorarioForm.value); // Depuración
    if (this.editarHorarioForm.valid && this.selectedHorario) {
      const formValues = this.editarHorarioForm.value;

      // Convertir la fecha a zona horaria local
      const fechaLocal = new Date(formValues.fecha + 'T00:00:00');
      formValues.diaSemana = this.getDayOfWeek(fechaLocal); // Actualizar el día de la semana

      const horario = this.prepararHorario(
        formValues,
        this.selectedHorario.id!
      );
      this.horarioService
        .updateHorarioFedatario(horario.id!, horario)
        .subscribe(() => {
          this.recargarHorarios();
          this.modalRef?.hide();
        });
    }
  }

  // Ajustar la función prepararHorario para que maneje la zona horaria local
  prepararHorario(formValues: any, id?: number): HorarioFedatario {
    const idUsuario = Number(localStorage.getItem('userId'));
    const usuario = new Usuario();
    usuario.idUsuario = idUsuario;

    // Convertir la fecha a zona horaria local
    const partesFecha = formValues.fecha.split('-');
    const fechaLocal = new Date(
      parseInt(partesFecha[0], 10),
      parseInt(partesFecha[1], 10) - 1,
      parseInt(partesFecha[2], 10)
    );

    // Crear un objeto base para HorarioFedatario
    let horario: any = {
      diaSemana: formValues.diaSemana,
      horaInicio: formValues.horaInicio,
      horaFin: formValues.horaFin,
      fecha: fechaLocal.toISOString().split('T')[0], // Convertir de nuevo a formato 'YYYY-MM-DD'
      usuario: { idUsuario: idUsuario },
    };

    // Incluir el campo 'id' solo si se está editando un horario existente
    if (id !== undefined && id !== null) {
      horario = { ...horario, id: id };
    }

    return horario;
  }

  cargarHorarios() {
    const userId = localStorage.getItem('userId'); // Asume que guardas el ID del usuario en el almacenamiento local
    if (userId) {
      this.horarioService
        .getHorariosPorUsuarioId(+userId)
        .subscribe((horarios) => (this.horariosFedatarios = horarios));
    }
  }

  // Método para convertir un horario a un evento de calendario
  convertToCalendarEvent(horario: HorarioFedatario): CalendarEvent {
    // Asegúrate de que la fecha y la hora se estén formateando correctamente aquí
    const fechaInicio = new Date(horario.fecha + 'T' + horario.horaInicio);
    const fechaFin = new Date(horario.fecha + 'T' + horario.horaFin);

    return {
      title: `Horario de ${'Fedator'}`,
      start: fechaInicio,
      end: fechaFin,
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
      meta: { id: horario.id },
    };
  }

  setView(view: CalendarView) {
    this.view = view;
    this.updateFormattedDate();
  }

  // Métodos para abrir, editar y eliminar horarios
  openModal(template: TemplateRef<any>, horario?: HorarioFedatario) {
    if (!horario) {
      const fechaActual = new Date();
      horario = new HorarioFedatario();
      horario.fecha = this.formatFecha(fechaActual); // Fecha por defecto para nuevos horarios
      horario.diaSemana = this.getDayOfWeek(fechaActual); // Día de la semana actual
    }
    this.modalData = { event: horario, isNew: !horario };
    this.horarioForm.reset(horario);
    this.modalRef = this.modalService.show(template);
  }

  addEvent(): void {
    const newEvent: CalendarEvent = {
      title: 'Nuevo Horario', // Puedes cambiar esto por un título dinámico
      start: new Date(), // Establece la fecha y hora de inicio
      end: new Date(), // Establece la fecha y hora de fin
      color: { primary: '#e3bc08', secondary: '#FDF1BA' }, // Colores del evento
    };

    this.events.push(newEvent);
    this.refresh.next(); // Refrescar la vista del calendario
  }

  editEvent(eventToEdit: CalendarEvent): void {
    // Convertir el evento del calendario a HorarioFedatario
    const horario: HorarioFedatario = {
      id: eventToEdit.meta.id, // Asumiendo que guardaste el ID del horario aquí
      diaSemana: this.getDayOfWeek(eventToEdit.start), // Necesitarás implementar getDayOfWeek
      horaInicio: eventToEdit.start.toTimeString().split(' ')[0], // Formato de hora 'HH:MM:SS'
      horaFin: eventToEdit.end!.toTimeString().split(' ')[0], // Formato de hora 'HH:MM:SS'
      usuario: eventToEdit.meta.usuario, // Asumiendo que guardaste el ID del usuario aquí
      fecha: this.formatFecha(eventToEdit.start), // Formatea la fecha del evento
    };

    // Abre el modal de edición con los detalles del horario
    this.modalData = {
      event: horario,
      isNew: false,
    };
    this.horarioForm.reset(horario); // Restablece el formulario con los datos del horario
    this.modalRef = this.modalService.show(this.eventModal);
  }

  // Método para obtener el día de la semana
  getDayOfWeek(date: Date): string {
    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    return days[date.getDay()];
  }

  deleteEvent(eventId: number) {
    this.events = this.events.filter((event) => event.meta.id !== eventId);
    this.refresh.next(); // Refrescar la vista del calendario
  }

  editHorario(horario: HorarioFedatario) {
    this.modalData = { event: horario, isNew: false };
    this.openModal(this.eventModal);
  }

  deleteHorario(horarioId: number) {
    // Implementar lógica para eliminar el horario
    // Por ejemplo, llamando a un servicio que comunica con el backend
  }

  onSubmitHorario(): void {
    if (this.modalData?.isNew) {
      this.crearHorario();
    } else if (this.selectedHorario) {
      this.editarHorario();
    } else {
      console.error('Error: modalData no está definido');
    }
  }

  eliminarHorario(id: number) {
    this.horarioService.deleteHorarioFedatario(id).subscribe(() => {
      this.recargarHorarios(); // Método para recargar la lista y los eventos del calendario
    });
  }

  recargarHorarios() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.horarioService
        .getHorariosPorUsuarioId(+userId)
        .subscribe((horarios) => {
          this.horariosFedatarios = horarios;
          this.events = horarios.map((horario) =>
            this.convertToCalendarEvent(horario)
          );
          this.refresh.next(); // Refrescar la vista del calendario
        });
    }
  }

  navigate(amount: number): void {
    // Mover el calendario un mes/día hacia adelante o hacia atrás
    if (this.view === CalendarView.Month) {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth() + amount,
        1
      );
    } else if (this.view === CalendarView.Day) {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth(),
        this.viewDate.getDate() + amount
      );
    }
    this.updateFormattedDate();
  }

  updateFormattedDate(): void {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (this.view === CalendarView.Month) {
      this.formattedDate = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
      }).format(this.viewDate);
    } else if (this.view === CalendarView.Day) {
      this.formattedDate = new Intl.DateTimeFormat('es-ES', options).format(
        this.viewDate
      );
    }
  }

  // Método adicional para formatear la fecha al formato deseado (puedes ajustar el formato según tus necesidades)
  formatFecha(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'es');
  }

  formatFechaCalendar(dateString: string): string {
    // Dividir la fecha en partes y crear una nueva fecha en la zona horaria local
    const partes = dateString.split('-');
    const año = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript empiezan en 0
    const dia = parseInt(partes[2], 10);

    const date = new Date(año, mes, dia);
    return formatDate(date, 'dd/MM/yyyy', 'es'); // Aquí pasamos 'es' como el locale
  }

  actualizarDiaSemana(): void {
    const fechaValue = this.crearHorarioForm.get('fecha')?.value;
    if (fechaValue) {
      const partes = fechaValue.split('-');
      const año = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript empiezan en 0
      const dia = parseInt(partes[2], 10);

      const fecha = new Date(año, mes, dia);
      const diaSemana = this.getDayOfWeek(fecha);
      this.crearHorarioForm.get('diaSemana')?.setValue(diaSemana);
    }
  }
  //Opciones de modales para cierre y muestra
  // Mostrar el modal
  mostrarModal() {
    const modalElement = this.successModal.nativeElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
  }

  ocultarModal() {
    const modalElement = this.successModal.nativeElement;
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
  }

  esHorarioPasado(fechaHorario: string, horaFin: string): boolean {
    const ahora = new Date();
    const fechaHoraFin = new Date(`${fechaHorario}T${horaFin}`);

    return fechaHoraFin < ahora;
  }

  obtenerEstadoHorario(horario: HorarioFedatario): string {
    return this.esHorarioPasado(horario.fecha, horario.horaFin)
      ? 'Horario ya pasado'
      : 'Pendiente de atencion';
  }
}

import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit  } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Calendar } from '@fullcalendar/core'; // Importa Calendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Importa el plugin DayGrid
import * as Pikaday from 'pikaday';

@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css']
})
export class LegajoComponent implements AfterViewInit  {

  fecha: any
  hoy: any
  pipe: any
  fila:any
  bandera: boolean = false
  habilitar: boolean = false
  visibilidad: boolean = true


  constructor( private render: Renderer2 ){
  }

  ngOnInit(): void {

    this.hoy = new Date
    this.pipe = new DatePipe('en-US')
    let ChangedFormat = this.pipe.transform(this.hoy, 'dd/MM/YYYY');
    this.fecha = ChangedFormat;
    
  }
  mostrarBotonTerminos = true; // Inicialmente visible

  validar(aceptado: number,valor: number) {
    // Aquí puedes realizar alguna lógica de validación si es necesario
    if (aceptado === 1) {
      this.mostrarBotonTerminos = false; // Ocultar el botón
    }
    if (valor > 0){
      this.bandera =  true
      this.inicializarCalendario();
    }
  }

  
  // Matriz de objetos para la insercion de documentos
  documentos: any[] = [{ tipoDocumento: 1, archivo: null, url: '' }];

  agregarFila() {
    this.documentos.push({ tipoDocumento: 1, archivo: null, url: '' });
  }
  eliminarFila(index: number) {
    this.documentos.splice(index, 1);
  }
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.documentos[index].archivo = file;
    }
  }


  calendar: Calendar | null = null;
  nuevaFecha: string = ''; // Para almacenar la nueva fecha
  eventoId: string | null = null; // Para almacenar el ID del evento a eliminar
  nombreEvento: string = ''; // Variable para el nombre del evento

  ngAfterViewInit(): void {
    if (this.bandera === true) {
      this.inicializarCalendario();
    }
  }

  inicializarCalendario() {
    const calendarEl = document.getElementById('calendar');

    if (calendarEl) {
      this.calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [
          // Eventos de ejemplo
          {
            id: '1',
            title: 'Evento 1',
            start: '2023-10-10',
            color: 'green'
          },
          {
            id: '2',
            title: 'Evento 2',
            start: '2023-10-15',
            color: 'blue'
          }
        ],
        eventClick: (info) => {
          this.eventoId = info.event.id;
        },
      });
      this.calendar.render();
    }
  }

  abrirModal() {
    // Abre el modal para agregar un evento
    this.nombreEvento = ''; // Limpia el nombre del evento
    document.getElementById('eventoModal')?.classList.add('show');
  }
  
  agregarEvento(nuevaFecha: string) {
    if (this.eventoId == '3'){
      let numero = parseInt(this.eventoId , 10);
      numero++;
      this.eventoId = numero.toString();
    }
    if (this.calendar && nuevaFecha) {
      this.calendar.addEvent({
        id: this.eventoId?.toString(),
        title: this.nombreEvento, // Utiliza el nombre del evento ingresado
        start: nuevaFecha,
        color: 'red' // Define el color del cuadro de fondo del nuevo evento
      });
      this.calendar.render();
      this.nuevaFecha = '';
      this.nombreEvento = ''; // Limpia el nombre del evento
      document.getElementById('eventoModal')?.classList.remove('show'); // Cierra el modal
    }
  }

  borrarEvento() {
    if (this.calendar && this.eventoId) {
      const evento = this.calendar.getEventById(this.eventoId);
      if (evento) {
        evento.remove();
        this.eventoId = null;
      }
    }
  }
}


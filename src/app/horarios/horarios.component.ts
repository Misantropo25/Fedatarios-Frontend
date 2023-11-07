import { Component } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core'; // Importa Calendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Importa el plugin DayGrid
import * as Pikaday from 'pikaday';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
})
export class HorariosComponent implements AfterViewInit {
  calendar: Calendar | null = null;
  nuevaFecha: string = ''; // Para almacenar la nueva fecha
  eventoId: string | null = null; // Para almacenar el ID del evento a eliminar
  nombreEvento: string = ''; // Variable para el nombre del evento

  constructor() {}
  ngAfterViewInit(): void {
    const calendarEl = document.getElementById('calendar');

    if (calendarEl) {
      this.calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [
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

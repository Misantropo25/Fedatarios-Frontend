import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css']
})
export class LegajoComponent implements OnInit {

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
    }
  }

  aumentar(){
    $('#aumentar').click(function() {
      $('#tabla>tbody').append('<tr><td><select class="form-control form-select-sm" aria-label="Small select example"><option selected>Tipo de Documento</option><option value="1">Resolucion</option><option value="2">Titulo</option><option value="3">Diplomas</option><option value="4">Maestria</option></select></td><td><div class="d-flex justify-content-between"><input class="form-control file" id="formFileLg" type="file">  <button type="button" class="btn btn-warning"><i class="fa-solid fa-trash"></i></button></div></td><td><input type="text" placeholder="Agregar URL" class="form-control"></td></tr>');
    });
  }

}


import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-firmar',
  templateUrl: './firmar.component.html',
  styleUrls: ['./firmar.component.css']
})
export class FirmarComponent implements OnInit{

  @ViewChild('imagen') imagen: ElementRef | undefined

  fecha: any
  hoy: any
  pipe: any
  fila:any
  data: any

  constructor( private render: Renderer2 ){

  }

  ngOnInit(): void {

    this.hoy = new Date
    this.pipe = new DatePipe('en-US')
    let ChangedFormat = this.pipe.transform(this.hoy, 'dd/MM/YYYY');
    this.fecha = ChangedFormat;

  }

  visualizar(){

    this.render.setAttribute(this.imagen?.nativeElement, 'src', '../../assets/imagenes/certificado.jpg')

  }

}

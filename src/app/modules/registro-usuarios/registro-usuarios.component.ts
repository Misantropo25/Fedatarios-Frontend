import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Agrega esta importación
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.css']
})
export class RegistroUsuariosComponent implements OnInit{
  
  constructor( private router: Router){
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    // Aquí puedes agregar la lógica para procesar el formulario, como enviar los datos al servidor.
  }
  acceder(){
    this.router.navigate(['/login']);
  }
}


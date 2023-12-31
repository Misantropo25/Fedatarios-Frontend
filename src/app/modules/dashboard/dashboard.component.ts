import { NgClass } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  modalRef: BsModalRef | undefined;
  bandera: boolean = false;

  constructor( private modalServicio: BsModalService, private router: Router){

  }

  ngOnInit(): void {

  }

  logout(): void {
    localStorage.removeItem('token'); // Elimina el token JWT
    localStorage.removeItem('userId'); // Elimina el dni
    localStorage.removeItem('userDni'); // Elimina el id
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }

  //Gestion del menu
  isAdminMenuVisible: boolean = false;

  toggleAdminMenu() {
    this.isAdminMenuVisible = !this.isAdminMenuVisible;
  }

}

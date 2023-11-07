import { NgClass } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  modalRef: BsModalRef | undefined;
  bandera: boolean = false;

  constructor( private modalServicio: BsModalService){

  }

  ngOnInit(): void {

  }



}

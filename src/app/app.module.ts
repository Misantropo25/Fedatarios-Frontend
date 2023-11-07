import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';
import { RegistroFedatariosComponent } from './registro-fedatarios/registro-fedatarios.component';
import { SubirArchivosComponent } from './subir-archivos/subir-archivos.component';
import { HorariosComponent } from './horarios/horarios.component';
import { LegajoComponent } from './legajo/legajo.component';
import * as $ from 'jquery';
import * as jQuery from 'jquery';
import * as bootstrap from 'bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { FirmarComponent } from './firmar/firmar.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegistroUsuariosComponent,
    RegistroFedatariosComponent,
    SubirArchivosComponent,
    HorariosComponent,
    LegajoComponent,
    FirmarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

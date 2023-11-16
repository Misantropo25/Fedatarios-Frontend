import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { RegistroUsuariosComponent } from './modules/registro-usuarios/registro-usuarios.component';
import { RegistroFedatariosComponent } from './modules/registro-fedatarios/registro-fedatarios.component';
import { SubirArchivosComponent } from './modules/subir-archivos/subir-archivos.component';
import { HorariosComponent } from './modules/horarios/horarios.component';
import { LegajoComponent } from './modules/legajo/legajo.component';
import * as $ from 'jquery';
import * as jQuery from 'jquery';
import * as bootstrap from 'bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { FirmarComponent } from './modules/firmar/firmar.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PerfilComponent } from './modules/perfil/perfil.component';


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
    PerfilComponent,
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

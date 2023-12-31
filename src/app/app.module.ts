import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClientModule } from '@angular/common/http';
import { FlatpickrModule } from 'angularx-flatpickr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/auth/login/login.component';
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
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './shared/components/modal/modal.component';
import { Modal2Component } from './shared/components/modal2/modal2.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { UsuariosComponent } from './modules/maintenance/usuarios/usuarios.component';
import { RolesComponent } from './modules/maintenance/roles/roles.component';
import { LegajosComponent } from './modules/maintenance/legajos/legajos.component';
import { DocumentosEscanedosComponent } from './modules/maintenance/documentos-escanedos/documentos-escanedos.component';
import { TipoDocumentosComponent } from './modules/maintenance/tipo-documentos/tipo-documentos.component';
import { ObservacionesComponent } from './modules/maintenance/observaciones/observaciones.component';
import { DeclaracionesJuradasComponent } from './modules/maintenance/declaraciones-juradas/declaraciones-juradas.component';
import { JwtInterceptor } from './core/security/jwt.interceptor';
import { SafeUrlPipe } from './shared/pipes/safe-url.pipe';
import { SeguimientoComponent } from './modules/seguimiento/seguimiento.component';


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
    ModalComponent,
    Modal2Component,
    UsuariosComponent,
    RolesComponent,
    LegajosComponent,
    DocumentosEscanedosComponent,
    TipoDocumentosComponent,
    ObservacionesComponent,
    DeclaracionesJuradasComponent,
    SafeUrlPipe,
    SeguimientoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AppRoutingModule,
    FullCalendarModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }

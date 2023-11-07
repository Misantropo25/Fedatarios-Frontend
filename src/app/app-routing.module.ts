import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';
import { RegistroFedatariosComponent } from './registro-fedatarios/registro-fedatarios.component';
import { SubirArchivosComponent } from './subir-archivos/subir-archivos.component';
import { HorariosComponent } from './horarios/horarios.component';
import { LegajoComponent } from './legajo/legajo.component';
import { FirmarComponent } from './firmar/firmar.component';

const routes: Routes = [
  { path: 'login', component:LoginComponent },
  { path: 'dashboard', component:DashboardComponent,
    children:
    [
      { path: 'usuarios', component:RegistroUsuariosComponent },
      { path: 'fedatarios', component:RegistroFedatariosComponent },
      { path: 'archivos', component:SubirArchivosComponent},
      { path: 'horarios', component:HorariosComponent },
      { path: 'legajo', component:LegajoComponent },
      { path: 'firmar', component:FirmarComponent}
    ]
  },
  { path: 'registro_usuarios', component:RegistroUsuariosComponent },
  { path: '', pathMatch:'full', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { RegistroUsuariosComponent } from './modules/registro-usuarios/registro-usuarios.component';
import { RegistroFedatariosComponent } from './modules/registro-fedatarios/registro-fedatarios.component';
import { SubirArchivosComponent } from './modules/subir-archivos/subir-archivos.component';
import { HorariosComponent } from './modules/horarios/horarios.component';
import { LegajoComponent } from './modules/legajo/legajo.component';
import { FirmarComponent } from './modules/firmar/firmar.component';
import { PerfilComponent } from './modules/perfil/perfil.component';

const routes: Routes = [
  // Falta separar los acceso a las rutas segun los roles usuario - fedatario - admin
  { path: 'login', component:LoginComponent },
  { path: 'dashboard', component:DashboardComponent,
    children:
    [
      { path: 'perfil', component:PerfilComponent },
      { path: 'usuarios', component:RegistroUsuariosComponent },
      { path: 'fedatarios', component:RegistroFedatariosComponent },
      { path: 'archivos', component:SubirArchivosComponent},
      { path: 'horarios', component:HorariosComponent },
      { path: 'legajo', component:LegajoComponent },
      { path: 'firmar', component:FirmarComponent}
    ]
  },
  { path: 'registro_usuarios', component:RegistroUsuariosComponent },
  { path: '', pathMatch:'full', redirectTo: '/login' },
  // Redireccion en caso de rutas no especificadas
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

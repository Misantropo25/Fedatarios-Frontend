import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = `${environment.baseUrl}/api/usuarios`;
  //private apiUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuario_list`);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  getUsuariosPorFedatario(fedatarioId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(
      `${this.apiUrl}/fedatario/${fedatarioId}/usuarios`
    );
  }

  createUsuario(usuario: Usuario): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.apiUrl}/create_usuario`,
      JSON.stringify(usuario),
      { headers, responseType: 'text' }
    );
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerDatosReniec(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/datos-reniec/${dni}`);
  }

  getPerfilUsuario(): Observable<Usuario | null> {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return this.http.get<Usuario>(`${this.apiUrl}/${userId}`);
    } else {
      // Manejo de error o retorno de un Observable que emite null
      return of(null);
    }
  }

  getUsuariosPorFedatarioResponsable(fedatarioId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/fedatario/${fedatarioId}/usuarios`);
  }
}

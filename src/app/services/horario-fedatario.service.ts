import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioFedatario } from '../interfaces/horario-fedatario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HorarioFedatarioService {
  //private apiUrl = 'http://localhost:4000';
  private apiUrl = `${environment.baseUrl}/api/horarios-fedatarios`;
  
  constructor(private http: HttpClient) {}

  getHorariosFedatarios(): Observable<HorarioFedatario[]> {
    return this.http.get<HorarioFedatario[]>(this.apiUrl);
  }

  // Método para crear un único horario
  createHorarioFedatario(
    horario: HorarioFedatario
  ): Observable<HorarioFedatario> {
    const url = `${this.apiUrl}/single`;
    return this.http.post<HorarioFedatario>(url, horario);
  }

  // Método para crear múltiples horarios
  createMultipleHorariosFedatarios(
    horarios: HorarioFedatario[]
  ): Observable<HorarioFedatario[]> {
    return this.http.post<HorarioFedatario[]>(this.apiUrl, horarios);
  }

  updateHorarioFedatario(
    id: number,
    horario: HorarioFedatario
  ): Observable<HorarioFedatario> {
    return this.http.put<HorarioFedatario>(`${this.apiUrl}/${id}`, horario);
  }

  deleteHorarioFedatario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getHorariosPorUsuarioId(usuarioId: number): Observable<HorarioFedatario[]> {
    return this.http.get<HorarioFedatario[]>(
      `${this.apiUrl}/usuario/${usuarioId}`
    );
  }
}

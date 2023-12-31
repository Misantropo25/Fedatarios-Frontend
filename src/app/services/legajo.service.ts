import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Legajo } from '../interfaces/legajo.model';

@Injectable({
  providedIn: 'root'
})
export class LegajoService {
  private apiUrl = `${environment.baseUrl}/api/legajo`;

  constructor(private http: HttpClient) {}

  getLegajos(): Observable<Legajo[]> {
    return this.http.get<Legajo[]>(this.apiUrl);
  }

  getLegajoById(id: number): Observable<Legajo> {
    return this.http.get<Legajo>(`${this.apiUrl}/${id}`);
  }

  createLegajo(legajo: Legajo): Observable<Legajo> {
    return this.http.post<Legajo>(this.apiUrl, legajo);
  }

  updateLegajo(id: number, legajo: Legajo): Observable<Legajo> {
    return this.http.put<Legajo>(`${this.apiUrl}/${id}`, legajo);
  }

  deleteLegajo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para obtener legajos por usuario ID
  getLegajosPorUsuarioId(usuarioId: number): Observable<Legajo[]> {
    return this.http.get<Legajo[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

}
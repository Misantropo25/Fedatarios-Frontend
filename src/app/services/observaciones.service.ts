import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Observacion } from '../interfaces/observaciones.model';

@Injectable({
  providedIn: 'root'
})
export class ObservacionesService {
  //private apiUrl = 'http://192.168.1.11:4000/api/observaciones'; // Ajusta según tu configuración
  private apiUrl = `${environment.baseUrl}/api/observaciones`;

  constructor(private http: HttpClient) { }

  getAllObservaciones(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getObservacionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addObservacion(observacion: any): Observable<any> {
    return this.http.post(this.apiUrl, observacion);
  }

  updateObservacion(id: number, observacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, observacion);
  }

  deleteObservacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  agregarObservacionesADocumento(idDocumento: number, observacionesDTO: Observacion[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/observar/${idDocumento}`, observacionesDTO);
  }

  getObservacionesPorDocumentoId(idDocumento: number): Observable<Observacion[]> {
    return this.http.get<Observacion[]>(`${this.apiUrl}/por-documento/${idDocumento}`);
  }
}

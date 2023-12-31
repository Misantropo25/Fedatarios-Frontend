import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentoEscaneadoEstado } from '../interfaces/documento_escaneado_estado.model'; // Asegúrate de tener este modelo

@Injectable({
  providedIn: 'root'
})
export class DocumentoEscaneadoEstadoService {
  private apiUrl = `${environment.baseUrl}/api/documento-estado`;

  constructor(private http: HttpClient) {}

  agregarEstado(nuevoEstado: DocumentoEscaneadoEstado): Observable<DocumentoEscaneadoEstado> {
    return this.http.post<DocumentoEscaneadoEstado>(this.apiUrl, nuevoEstado);
  }

  obtenerEstadoPorId(id: number): Observable<DocumentoEscaneadoEstado> {
    return this.http.get<DocumentoEscaneadoEstado>(`${this.apiUrl}/${id}`);
  }

  actualizarEstado(id: number, estadoActualizado: DocumentoEscaneadoEstado): Observable<DocumentoEscaneadoEstado> {
    return this.http.put<DocumentoEscaneadoEstado>(`${this.apiUrl}/${id}`, estadoActualizado);
  }

  eliminarEstado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerEstadoMasRecientePorDocumento(idDocumento: number): Observable<DocumentoEscaneadoEstado> {
    return this.http.get<DocumentoEscaneadoEstado>(`${this.apiUrl}/estado-mas-reciente/${idDocumento}`);
  }

  getEstadosPorDocumento(idDocumento: number): Observable<DocumentoEscaneadoEstado[]> {
    return this.http.get<DocumentoEscaneadoEstado[]>(`${this.apiUrl}/por-documento/${idDocumento}`);
  }
}
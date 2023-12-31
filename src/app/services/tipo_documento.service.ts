import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../interfaces/tipo_documento.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  //private apiUrl = 'http://localhost:4000';
  private apiUrl = `${environment.baseUrl}/api/tipo-documentos`;

  constructor(private http: HttpClient) {}

  getTiposDocumento(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/all');
  }

  getAllTipoDocumentos(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.apiUrl}/all`);
  }

  getTipoDocumento(id: number): Observable<TipoDocumento> {
    return this.http.get<TipoDocumento>(`${this.apiUrl}/${id}`);
  }

  createTipoDocumento(tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
    return this.http.post<TipoDocumento>(this.apiUrl, tipoDocumento);
  }

  updateTipoDocumento(id: number, tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
    return this.http.put<TipoDocumento>(`${this.apiUrl}/${id}`, tipoDocumento);
  }

  deleteTipoDocumento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
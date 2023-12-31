import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentoEscaneado } from '../interfaces/documento_escaneado.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentosEscaneadosService {
  private apiUrl = `${environment.baseUrl}/api/documentos-escaneados`;

  constructor(private http: HttpClient) {}

  // Obtener todos los documentos escaneados
  getAllDocumentosEscaneados(): Observable<DocumentoEscaneado[]> {
    return this.http.get<DocumentoEscaneado[]>(`${this.apiUrl}/listar_documentos`);
  }

  // Obtener un documento escaneado por ID
  getDocumentoEscaneadoById(id: number): Observable<DocumentoEscaneado> {
    return this.http.get<DocumentoEscaneado>(`${this.apiUrl}/${id}`);
  }

  buscarPorLegajoId(legajoId: number): Observable<DocumentoEscaneado[]> {
    return this.http.get<DocumentoEscaneado[]>(`${this.apiUrl}/buscar_por_legajo/${legajoId}`);
  }

  buscarPorDni(dni: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar_por_dni/${dni}`);
}
  // Crear un nuevo documento escaneado
  createDocumentoEscaneado(documento: DocumentoEscaneado): Observable<DocumentoEscaneado> {
    return this.http.post<DocumentoEscaneado>(this.apiUrl, documento);
  }

  // Actualizar un documento escaneado
  updateDocumentoEscaneado(id: number, documento: DocumentoEscaneado): Observable<DocumentoEscaneado> {
    return this.http.put<DocumentoEscaneado>(`${this.apiUrl}/${id}`, documento);
  }

  // Eliminar un documento escaneado
  deleteDocumentoEscaneado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Subir documentos escaneados
  uploadDocumentos(documentos: DocumentoEscaneado[], idUsuario: number, idFedatarioResponsable: number): Observable<any> {
    const formData = new FormData();
    // console.log("En el servicio: ", documentos)
    // console.log("Creado por el usuario: ", idUsuario)
    documentos.forEach((documento) => {
      if (documento.file && documento.file instanceof File) {
        formData.append('files', documento.file, documento.file.name);
        console.log(documento.file.name);
        formData.append('tipoDocumentoIds', documento.tipoDocumentoId.toString());
        console.log(documento.tipoDocumentoId.toString());
      }
    });
    formData.append('usuarioId', idUsuario.toString());
    formData.append('idFedatarioResponsable', idFedatarioResponsable.toString());
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  //Descargar los documentos para su visualizacion
  getDownloadUrl(id: number): string {
    return `${this.apiUrl}/descargar/${id}`;
  }

  getVisualizarUrl(id: number): string {
    return `${this.apiUrl}/visualizar/${id}`;
  }

  cambiarEstado(idDocumento: number, idEstado: number): Observable<any> {
    const params = new HttpParams()
      .set('idDocumento', idDocumento.toString())
      .set('idEstado', idEstado.toString());
    return this.http.post(`${this.apiUrl}/cambiarEstado`, params);
  }

}
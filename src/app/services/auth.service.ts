import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt"; // Necesitarás instalar @auth0/angular-jwt

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.baseUrl}/api/auth`; // Ajusta según tu configuración
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user); // Usa backticks aquí
  }

  // login(credentials: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, credentials); // Y aquí también
  // }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString()); // Almacena el ID del usuario
        localStorage.setItem('userDni', response.userDni); // Almacena el DNI del usuario
        // Guarda cualquier otra información necesaria
      }));
  }

  public refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    // Realizar la petición para obtener un nuevo token
    return this.http.post<string>('/api/refresh-token', { refreshToken });
  }
}
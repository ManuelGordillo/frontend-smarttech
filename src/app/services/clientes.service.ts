import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientesInterface } from '../interfaces/clientes.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Crear headers con el token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getClientes(): Observable<ClientesInterface[]> {
    return this.http.get<ClientesInterface[]>(`${this.apiUrl}/clientes/listar`, {
      headers: this.getHeaders(),
    });
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.get<ClientesInterface[]>(`${this.apiUrl}/clientes/eliminar/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

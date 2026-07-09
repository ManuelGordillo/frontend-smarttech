import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  // ==========================================
  // OBTENER TODOS LOS CLIENTES
  // ==========================================
  getClientes(): Observable<ClientesInterface[]> {
    return this.http.get<ClientesInterface[]>(`${this.apiUrl}/clientes/listar`, {
      headers: this.getHeaders(),
    });
  }

  // ==========================================
  // BUSCAR CLIENTES POR DNI O NOMBRE ✅ NUEVO
  // ==========================================
  buscarClientes(dni?: string, nombre?: string): Observable<ClientesInterface[]> {
    let params = new HttpParams();

    if (dni && dni.trim() !== '') {
      params = params.set('dni', dni.trim());
    }

    if (nombre && nombre.trim() !== '') {
      params = params.set('nombre', nombre.trim());
    }

    return this.http.get<ClientesInterface[]>(`${this.apiUrl}/clientes/buscar`, {
      headers: this.getHeaders(),
      params: params,
    });
  }

  // ==========================================
  // CREAR CLIENTE
  // ==========================================
  crearCliente(cliente: ClientesInterface): Observable<ClientesInterface> {
    return this.http.post<ClientesInterface>(`${this.apiUrl}/clientes/crear`, cliente, {
      headers: this.getHeaders(),
    });
  }

  // ==========================================
  // ELIMINAR CLIENTE
  // ==========================================
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/eliminar/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ==========================================
  // ACTUALIZAR CLIENTE ✅ OPCIONAL
  // ==========================================
  actualizarCliente(id: number, cliente: ClientesInterface): Observable<ClientesInterface> {
    return this.http.put<ClientesInterface>(`${this.apiUrl}/clientes/actualizar/${id}`, cliente, {
      headers: this.getHeaders(),
    });
  }
}

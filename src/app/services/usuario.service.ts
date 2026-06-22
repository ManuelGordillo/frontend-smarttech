import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendedor } from '../models/vendedor.model/vendedor.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  // Obtener token del localStorage
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

  // ✅ CREAR VENDEDOR (público - sin token)
  crearVendedor(data: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/crear-vendedor`, data, {
      responseType: 'text',
    });
  }

  // ✅ LISTAR VENDEDORES - CAMBIADO A /usuarios/vendedores
  getVendedores(): Observable<Vendedor[]> {
    return this.http.get<Vendedor[]>(`${this.apiUrl}/usuarios/vendedores`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ CAMBIAR ESTADO DEL VENDEDOR - CAMBIADO A /usuarios/cambiar-estado/{id}
  cambiarEstadoVendedor(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/usuarios/cambiar-estado/${id}`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }

  // ✅ ELIMINAR VENDEDOR - CAMBIADO A /usuarios/eliminar/{id}
  eliminarVendedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/eliminar/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ OBTENER VENDEDOR POR ID - CAMBIADO A /usuarios/buscar/{id}
  getVendedorById(id: number): Observable<Vendedor> {
    return this.http.get<Vendedor>(`${this.apiUrl}/usuarios/buscar/${id}`, {
      headers: this.getHeaders(),
    });
  }
  // ✅ ACTUALIZAR VENDEDOR
  actualizarVendedor(vendedor: Vendedor): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/actualizar/${vendedor.id}`, vendedor, {
      headers: this.getHeaders(),
    });
  }
}

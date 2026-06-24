import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoInterface } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/productos';

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
      console.log('🔑 Token enviado:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No hay token disponible');
    }

    return headers;
  }

  // ✅ LISTAR PRODUCTOS (GET /productos/listar)
  getProductos(): Observable<ProductoInterface[]> {
    console.log('📡 GET:', `${this.apiUrl}/listar`);
    return this.http.get<ProductoInterface[]>(`${this.apiUrl}/listar`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ CREAR PRODUCTO (POST /productos/crear)
  crearProducto(producto: any): Observable<ProductoInterface> {
    console.log('📡 POST:', `${this.apiUrl}/crear`);
    console.log('📦 Producto:', JSON.stringify(producto, null, 2));
    return this.http.post<ProductoInterface>(`${this.apiUrl}/crear`, producto, {
      headers: this.getHeaders(),
    });
  }

  // ✅ ACTUALIZAR PRODUCTO (PUT /productos/actualizar/{id}/{modelo})
  actualizarProducto(
    id: number,
    modelo: string,
    producto: ProductoInterface,
  ): Observable<ProductoInterface> {
    console.log('📡 PUT:', `${this.apiUrl}/actualizar/${id}/${modelo}`);
    return this.http.put<ProductoInterface>(`${this.apiUrl}/actualizar/${id}/${modelo}`, producto, {
      headers: this.getHeaders(),
    });
  }

  // ✅ ELIMINAR PRODUCTO (DELETE /productos/eliminar/{id})
  eliminarProducto(id: number): Observable<any> {
    console.log('📡 DELETE:', `${this.apiUrl}/eliminar/${id}`);
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ BUSCAR POR MARCA (GET /productos/marca/{marca})
  buscarPorMarca(marca: string): Observable<ProductoInterface[]> {
    console.log('📡 GET:', `${this.apiUrl}/marca/${marca}`);
    return this.http.get<ProductoInterface[]>(`${this.apiUrl}/marca/${marca}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ BUSCAR POR ID (GET /productos/buscar/{id})
  getProductoById(id: number): Observable<ProductoInterface> {
    console.log('📡 GET:', `${this.apiUrl}/buscar/${id}`);
    return this.http.get<ProductoInterface>(`${this.apiUrl}/buscar/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ CAMBIAR ESTADO (recibe string: 'Disponible' o 'Agotado')
  cambiarEstadoProducto(id: number, estado: string): Observable<any> {
    console.log('📡 PATCH:', `${this.apiUrl}/cambiar-estado/${id}`);
    console.log('📦 Estado:', estado);
    return this.http.patch(
      `${this.apiUrl}/cambiar-estado/${id}`,
      { estado },
      {
        headers: this.getHeaders(),
      },
    );
  }
}

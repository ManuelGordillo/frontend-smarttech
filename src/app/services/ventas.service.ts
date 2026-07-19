// services/ventas.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  // ==========================================
  // CREAR VENTA (SOLO LA VENTA)
  // ==========================================
  crearVenta(venta: any): Observable<any> {
    // ✅ Cambiar VentaInterface por any
    const token = localStorage.getItem('token');

    console.log('🔑 Token en crearVenta:', token);

    if (!token) {
      console.error('❌ CRÍTICO: No hay token en localStorage');
    }

    console.log('📤 Enviando a:', `${this.apiUrl}/ventas/crear`);
    console.log('📦 Body:', JSON.stringify(venta, null, 2));

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    console.log('📋 Authorization:', headers.get('Authorization'));

    return this.http.post(`${this.apiUrl}/ventas/crear`, venta, {
      headers: headers,
    });
  }

  // ==========================================
  // OBTENER VENTAS
  // ==========================================
  // getVentas(): Observable<any[]> {
  //   // ✅ Cambiar a any[]
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   });

  //   return this.http.get<any[]>(`${this.apiUrl}/ventas/listar`, {
  //     headers: headers,
  //   });
  // }

  // ==========================================
  // OBTENER VENTAS - CORREGIDO
  // ==========================================
  getVentas(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('🔑 Token en getVentas:', token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // ✅ QUITAR responseType: 'text' - DEJAR QUE DEVUELVA JSON
    return this.http.get(`${this.apiUrl}/ventas/listar`, {
      headers: headers,
    });
  }

  // ==========================================
  // OBTENER VENTA POR ID
  // ==========================================
  getVentaById(id: number): Observable<any> {
    // ✅ Cambiar a any
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/ventas/buscar/${id}`, {
      headers: headers,
    });
  }
}

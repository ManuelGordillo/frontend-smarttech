import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080';

  crearVendedor(data: any) {
    return this.http.post(`${this.apiUrl}/crear-vendedor`, data, { responseType: 'text' });
  }
}

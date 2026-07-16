import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'smarttech-side-menu-header',
  imports: [RouterLink],
  templateUrl: './side-menu-header.html',
})
export class SideMenuHeader {
  nombreAdministrador = signal<string>('');
  rol = signal<string>('');

  ngOnInit(): void {
    const rol = localStorage.getItem('rol') || 'ADMINISTRADOR';
    this.rol.set(rol);

    const nombre =
      localStorage.getItem('nombre') ||
      localStorage.getItem('username') ||
      localStorage.getItem('nombreUsuario') ||
      localStorage.getItem('nombreVendedor') ||
      'Usuario';

    console.log('📌 Rol:', rol);
    console.log('📌 Nombre:', nombre);

    this.nombreAdministrador.set(nombre);
  }
}

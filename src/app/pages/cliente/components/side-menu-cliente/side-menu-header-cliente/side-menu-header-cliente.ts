import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'smarttech-side-menu-header-cliente',
  imports: [RouterLink],
  templateUrl: './side-menu-header-cliente.html',
})
export class SideMenuHeaderCliente implements OnInit {
  nombreCliente = signal<string>('');
  rol = signal<string>('');

  ngOnInit(): void {
    // 🔥 Obtener el rol
    const rol = localStorage.getItem('rol') || 'CLIENTE';
    this.rol.set(rol);

    // 🔥 Obtener el nombre del usuario (NO el rol)
    // El nombre debe venir de una clave específica
    const nombre =
      localStorage.getItem('nombre') ||
      localStorage.getItem('username') ||
      localStorage.getItem('nombreUsuario') ||
      localStorage.getItem('nombreVendedor') ||
      'Usuario';

    console.log('📌 Rol:', rol);
    console.log('📌 Nombre:', nombre);

    this.nombreCliente.set(nombre);
  }
}

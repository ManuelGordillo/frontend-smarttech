import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'smarttech-side-menu-header-vendedor',
  imports: [RouterLink],
  templateUrl: './side-menu-header-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuHeaderVendedor implements OnInit {
  nombreVendedor = signal<string>('');
  rol = signal<string>('');

  ngOnInit(): void {
    // 🔥 Obtener el rol
    const rol = localStorage.getItem('rol') || 'VENDEDOR';
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

    this.nombreVendedor.set(nombre);
  }
}

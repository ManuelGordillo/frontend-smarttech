import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'smarttech-sesiones-activas-cliente',
  imports: [CommonModule],
  templateUrl: './sesiones-activas-cliente.html',
})
export class SesionesActivasCliente {
  sesiones: any[] = [
    {
      id: 1,
      dispositivo: 'Chrome - Windows',
      ubicacion: 'Arequipa, Perú',
      activa: true,
      fecha: 'Activo ahora',
    },
    {
      id: 2,
      dispositivo: 'Safari - iPhone',
      ubicacion: 'Arequipa, Perú',
      activa: false,
      fecha: 'Hace 2 días',
    },
  ];

  cerrarSesion(id: number): void {
    if (confirm('¿Cerrar esta sesión?')) {
      this.sesiones = this.sesiones.filter((s) => s.id !== id);
      alert('✅ Sesión cerrada correctamente');
    }
  }

  cerrarTodas(): void {
    if (confirm('¿Cerrar todas las sesiones?')) {
      this.sesiones = [];
      alert('✅ Todas las sesiones fueron cerradas');
    }
  }
}

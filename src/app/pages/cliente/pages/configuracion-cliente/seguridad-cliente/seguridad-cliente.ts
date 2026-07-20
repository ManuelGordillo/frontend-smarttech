import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../../services/usuario.service';

@Component({
  selector: 'smarttech-seguridad-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './seguridad-cliente.html',
})
export class SeguridadCliente {
  private usuarioService = inject(UsuarioService);

  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  cambiando: boolean = false;

  cambiarContrasena(): void {
    if (!this.contrasenaActual || !this.nuevaContrasena || !this.confirmarContrasena) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.nuevaContrasena.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    const userId = localStorage.getItem('usuarioId') || localStorage.getItem('id') || '0';

    this.cambiando = true;
    this.usuarioService
      .cambiarContrasena({
        id: Number(userId),
        contrasenaActual: this.contrasenaActual,
        nuevaContrasena: this.nuevaContrasena,
      })
      .subscribe({
        next: () => {
          this.cambiando = false;
          alert('✅ Contraseña cambiada correctamente');
          this.contrasenaActual = '';
          this.nuevaContrasena = '';
          this.confirmarContrasena = '';
        },
        error: (error) => {
          this.cambiando = false;
          alert('❌ Error al cambiar la contraseña: ' + (error.error || 'Intenta nuevamente'));
        },
      });
  }
}

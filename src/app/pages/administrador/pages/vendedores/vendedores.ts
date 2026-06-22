import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { Vendedor } from '../../../../models/vendedor.model/vendedor.model';

@Component({
  selector: 'app-vendedores',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './vendedores.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class VendedoresComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  vendedores: Vendedor[] = [];
  loading: boolean = false;
  error: string = '';
  mensajeExito: string = '';

  // 🔥 PARA EL MODAL
  modalAbierto: boolean = false;
  vendedorEditando: Vendedor | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = '⚠️ No has iniciado sesión. Por favor, inicia sesión primero.';
      return;
    }
    this.cargarVendedores();
  }

  cargarVendedores(): void {
    this.loading = true;
    this.error = '';

    this.usuarioService.getVendedores().subscribe({
      next: (data) => {
        this.vendedores = data;
        this.loading = false;
        console.log('✅ Vendedores cargados:', data);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        if (error.status === 401) {
          this.error = '⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else {
          this.error = 'Error al cargar los vendedores. Verifica tu conexión.';
        }
        this.loading = false;
      },
    });
  }

  // 🔥 ABRIR MODAL
  abrirModal(vendedor: Vendedor): void {
    this.vendedorEditando = { ...vendedor };
    this.modalAbierto = true;
  }

  // 🔥 CERRAR MODAL
  cerrarModal(): void {
    this.modalAbierto = false;
    this.vendedorEditando = null;
  }

  // 🔥 GUARDAR CAMBIOS (conexión con backend)
  guardarCambios(): void {
    if (!this.vendedorEditando) return;

    this.usuarioService.actualizarVendedor(this.vendedorEditando).subscribe({
      next: () => {
        this.mensajeExito = `✅ ${this.vendedorEditando?.nombreUsuario} actualizado correctamente`;
        this.cargarVendedores();
        this.cerrarModal();
        setTimeout(() => (this.mensajeExito = ''), 3000);
      },
      error: (error) => {
        console.error('❌ Error al actualizar:', error);
        this.error = 'Error al actualizar el vendedor';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }

  cambiarEstado(vendedor: Vendedor): void {
    const accion = vendedor.estado ? 'desactivar' : 'activar';

    if (!confirm(`¿Estás seguro de ${accion} a "${vendedor.nombreUsuario}"?`)) {
      return;
    }

    this.usuarioService.cambiarEstadoVendedor(vendedor.id).subscribe({
      next: () => {
        vendedor.estado = !vendedor.estado;
        this.mensajeExito = `✅ ${vendedor.nombreUsuario} ${vendedor.estado ? 'activado' : 'desactivado'} correctamente`;
        setTimeout(() => (this.mensajeExito = ''), 3000);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        if (error.status === 401) {
          this.error = '⚠️ Sesión expirada. Inicia sesión nuevamente.';
        } else {
          this.error = 'Error al cambiar el estado del vendedor';
        }
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }

  eliminarVendedor(vendedor: Vendedor): void {
    if (
      !confirm(
        `¿Estás seguro de eliminar a "${vendedor.nombreUsuario}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    this.usuarioService.eliminarVendedor(vendedor.id).subscribe({
      next: () => {
        this.vendedores = this.vendedores.filter((v) => v.id !== vendedor.id);
        this.mensajeExito = `✅ ${vendedor.nombreUsuario} eliminado correctamente`;
        setTimeout(() => (this.mensajeExito = ''), 3000);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.error = 'Error al eliminar el vendedor';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }
}

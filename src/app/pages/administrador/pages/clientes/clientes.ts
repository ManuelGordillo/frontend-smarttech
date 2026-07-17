import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../../services/clientes.service';
import { ClientesInterface } from '../../../../interfaces/clientes.interface';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule],
  templateUrl: './clientes.html',
})
export default class Clientes implements OnInit {
  private clientesService = inject(ClientesService);

  clientes = signal<ClientesInterface[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');
  mensaje = signal<string>('');

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error.set('⚠️ No has iniciado sesión. Por favor, inicia sesión primero.');
      return;
    }
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading.set(true);
    this.error.set('');

    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes.set(data); // Actualizar signal
        this.loading.set(false);
        console.log('✅ Clientes cargados:', data);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        if (error.status === 401) {
          this.error.set('⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.');
        } else {
          this.error.set('Error al cargar los clientes. Verifica tu conexión.');
        }
        this.loading.set(false);
      },
    });
  }

  eliminarCliente(cliente: ClientesInterface): void {
    if (
      !confirm(
        `¿Estás seguro de eliminar a "${cliente.nombre} ${cliente.apellido}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    this.clientesService.eliminarCliente(cliente.id).subscribe({
      next: () => {
        // Actualizar signal con filter
        this.clientes.update((current) => current.filter((c) => c.id !== cliente.id));
        this.mensaje.set(`✅ ${cliente.nombre} ${cliente.apellido} eliminado correctamente`);
        setTimeout(() => this.mensaje.set(''), 3000);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.error.set('Error al eliminar el cliente');
        setTimeout(() => this.error.set(''), 3000);
      },
    });
  }
}

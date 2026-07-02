import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ClientesService } from '../../../../services/clientes.service';
import { ClientesInterface } from '../../../../interfaces/clientes.interface';

@Component({
  selector: 'app-clientes',
  imports: [],
  templateUrl: './clientes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Clientes implements OnInit {
  private clientesService = inject(ClientesService);

  clientes: ClientesInterface[] = [];
  loading: boolean = false;
  error: string = '';
  mensaje: string = '';

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = '⚠️ No has iniciado sesión. Por favor, inicia sesión primero.';
      return;
    }
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.error = '';

    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
        console.log('✅ Clientes cargados:', data);
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

  eliminarCliente(clientes: ClientesInterface): void {
    if (
      !confirm(
        `¿Estás seguro de eliminar a "${clientes.nombre}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    this.clientesService.eliminarCliente(clientes.id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter((c) => c.id !== clientes.id);
        this.mensaje = `✅ ${clientes.nombre} eliminado correctamente`;
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.error = 'Error al eliminar el vendedor';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }
}

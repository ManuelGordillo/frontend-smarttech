import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../../../services/clientes.service';

@Component({
  selector: 'smarttech-perfil-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-cliente.html',
})
export class PerfilCliente implements OnInit {
  private clientesService = inject(ClientesService);

  clienteId: number = 0;
  loading: boolean = true;
  guardando: boolean = false;

  cliente = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    dni: '',
    direccion: '',
  };

  ngOnInit(): void {
    this.cargarDatosCliente();
  }

  cargarDatosCliente(): void {
    const id =
      localStorage.getItem('clienteId') ||
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('id') ||
      '0';
    this.clienteId = Number(id);

    if (this.clienteId > 0) {
      this.clientesService.getClientes().subscribe({
        next: (clientes) => {
          const clienteEncontrado = clientes.find((c: any) => c.id === this.clienteId);
          if (clienteEncontrado) {
            this.cliente = {
              nombre: clienteEncontrado.nombre || '',
              apellido: clienteEncontrado.apellido || '',
              correo: clienteEncontrado.correo || '',
              telefono: clienteEncontrado.telefono || '',
              dni: clienteEncontrado.dni || '',
              direccion: clienteEncontrado.direccion || '',
            };
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.cargarDesdeLocalStorage();
        },
      });
    } else {
      this.cargarDesdeLocalStorage();
      this.loading = false;
    }
  }

  cargarDesdeLocalStorage(): void {
    const nombre =
      localStorage.getItem('nombreVendedor') ||
      localStorage.getItem('nombre') ||
      localStorage.getItem('nombreUsuario') ||
      '';
    this.cliente.nombre = nombre;
  }

  guardarCambios(): void {
    if (!this.cliente.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    this.guardando = true;

    // ✅ Agregar ID al objeto
    const clienteActualizado = {
      id: this.clienteId,
      nombre: this.cliente.nombre,
      apellido: this.cliente.apellido,
      correo: this.cliente.correo,
      telefono: this.cliente.telefono,
      dni: this.cliente.dni,
      direccion: this.cliente.direccion,
    };

    this.clientesService.actualizarCliente(this.clienteId, clienteActualizado).subscribe({
      next: () => {
        this.guardando = false;
        alert('✅ Perfil actualizado correctamente');
      },
      error: () => {
        this.guardando = false;
        alert('❌ Error al actualizar el perfil');
      },
    });
  }
}

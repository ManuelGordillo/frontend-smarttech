// clientes-vendedor.ts
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { ClientesVendedorHeader } from './clientes-vendedor-header/clientes-vendedor-header';
import { BuscarClientesVendedor } from './buscar-clientes-vendedor/buscar-clientes-vendedor';
import { TablaClientesVendedor } from './tabla-clientes-vendedor/tabla-clientes-vendedor';
import { NuevoClientesVendedor } from './nuevo-clientes-vendedor/nuevo-clientes-vendedor';

import { ClientesInterface } from '../../../../interfaces/clientes.interface';
import { ClientesService } from '../../../../services/clientes.service';
import { CarritoService } from '../../../../services/carrito.service'; // ✅ Importar

@Component({
  selector: 'app-clientes-vendedor',
  imports: [
    CommonModule,
    ClientesVendedorHeader,
    BuscarClientesVendedor,
    TablaClientesVendedor,
    NuevoClientesVendedor,
  ],
  templateUrl: './clientes-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientesVendedor implements OnInit {
  clientesFiltrados: ClientesInterface[] = [];
  cargando: boolean = false;

  constructor(
    private clientesService: ClientesService,
    private carritoService: CarritoService, // ✅ Inyectar carrito
  ) {
    console.log('🏗️ Constructor de ClientesVendedor ejecutado');
  }

  ngOnInit(): void {
    console.log('🚀 ngOnInit de ClientesVendedor se ejecutó');
    this.cargarTodosLosClientes();
  }

  // ==========================================
  // CARGAR TODOS LOS CLIENTES
  // ==========================================
  cargarTodosLosClientes(): void {
    console.log('🔄 cargarTodosLosClientes() se ejecutó');
    this.cargando = true;

    this.clientesService
      .getClientes()
      .pipe(
        finalize(() => {
          this.cargando = false;
          console.log('🏁 Finalizó carga - cargando = false');
        }),
      )
      .subscribe({
        next: (clientes) => {
          console.log('✅ Clientes recibidos:', clientes?.length || 0);
          this.clientesFiltrados = clientes || [];
        },
        error: (error) => {
          console.error('❌ Error al cargar clientes:', error);
          this.clientesFiltrados = [];
        },
      });
  }

  // ==========================================
  // BUSCAR CLIENTES
  // ==========================================
  onBuscar(filtros: { dni: string; nombre: string }): void {
    console.log('🔍 Buscando:', filtros);

    if (!filtros.dni && !filtros.nombre) {
      this.cargarTodosLosClientes();
      return;
    }

    this.cargando = true;
    this.clientesService
      .buscarClientes(filtros.dni, filtros.nombre)
      .pipe(
        finalize(() => {
          this.cargando = false;
          console.log('🏁 Finalizó búsqueda');
        }),
      )
      .subscribe({
        next: (clientes) => {
          console.log('✅ Resultados:', clientes?.length || 0);
          this.clientesFiltrados = clientes || [];
        },
        error: (error) => {
          console.error('❌ Error al buscar clientes:', error);
          this.clientesFiltrados = [];
        },
      });
  }

  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================
  onLimpiar(): void {
    console.log('🧹 Limpiando filtros');
    this.cargarTodosLosClientes();
  }

  // ==========================================
  // SELECCIONAR CLIENTE ✅ CONECTADO AL CARRITO
  // ==========================================
  onSeleccionarCliente(cliente: ClientesInterface): void {
    console.log('👤 Cliente seleccionado:', cliente.nombre, cliente.apellido);
    console.log('📋 DNI:', cliente.dni);

    // ✅ Guardar en el carrito
    this.carritoService.seleccionarCliente(cliente);

    console.log('✅ Cliente agregado al carrito correctamente');

    // ✅ Notificación visual (opcional)
    alert(`✅ Cliente seleccionado: ${cliente.nombre} ${cliente.apellido}`);
  }

  // ==========================================
  // CLIENTE CREADO
  // ==========================================
  onClienteCreado(): void {
    console.log('🆕 Cliente creado, recargando lista...');
    this.cargarTodosLosClientes();
  }
}

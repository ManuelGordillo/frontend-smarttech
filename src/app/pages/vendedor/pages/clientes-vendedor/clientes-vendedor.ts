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

  constructor(private clientesService: ClientesService) {
    console.log('🏗️ Constructor de ClientesVendedor ejecutado');
  }

  ngOnInit(): void {
    console.log('🚀 ngOnInit de ClientesVendedor se ejecutó');
    console.log('📋 Estado inicial - clientesFiltrados:', this.clientesFiltrados);
    console.log('📋 Estado inicial - cargando:', this.cargando);
    this.cargarTodosLosClientes();
  }

  // ==========================================
  // CARGAR TODOS LOS CLIENTES
  // ==========================================
  cargarTodosLosClientes(): void {
    console.log('🔄 cargarTodosLosClientes() se ejecutó');
    console.log('📡 Haciendo petición GET a: http://localhost:8080/clientes/listar');
    this.cargando = true;
    console.log('⏳ cargando = true');

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
          console.log('✅ Clientes recibidos del backend:', clientes);
          console.log('📊 Cantidad de clientes:', clientes?.length);
          console.log('🔍 Tipo de dato:', typeof clientes);
          console.log('🔍 ¿Es array?', Array.isArray(clientes));

          if (clientes && Array.isArray(clientes) && clientes.length > 0) {
            console.log('📋 Primer cliente:', clientes[0]);
            console.log(
              '📋 Nombres de los clientes:',
              clientes.map((c) => c.nombre),
            );
          } else {
            console.warn('⚠️ No hay clientes o la respuesta no es un array');
          }

          this.clientesFiltrados = clientes || [];
          console.log('📋 clientesFiltrados actualizado:', this.clientesFiltrados);
        },
        error: (error) => {
          console.error('❌ Error al cargar clientes:', error);
          console.error('❌ Detalle del error:', JSON.stringify(error, null, 2));
          this.clientesFiltrados = [];
          console.log('📋 clientesFiltrados vacío por error');
        },
      });
  }

  // ==========================================
  // PROBAR CON DATOS MOCK
  // ==========================================
  probarMock(): void {
    console.log('🧪 Probando con datos MOCK');
    this.clientesFiltrados = [
      {
        id: 1,
        nombre: 'Catalina',
        apellido: 'Gordillo',
        dni: '78443060',
        telefono: '986866584',
        correo: 'cgordillo@gmail.com',
        direccion: 'Arequipa',
        fechaRegistro: '2026-06-17',
      },
      {
        id: 2,
        nombre: 'Manuel',
        apellido: 'Mayorga',
        dni: '22222222',
        telefono: '986866584',
        correo: 'manuel@gmail.com',
        direccion: 'Urbanizacion Dunas',
        fechaRegistro: '2026-07-03',
      },
      {
        id: 3,
        nombre: 'Catalina Altana',
        apellido: 'Gordillo',
        dni: '78443060',
        telefono: '12547896',
        correo: 'cata@gmail.com',
        direccion: 'urbanizacion las mercedes',
        fechaRegistro: '2026-07-03',
      },
    ];
    this.cargando = false;
    console.log('✅ Mock cargado correctamente:', this.clientesFiltrados);
    console.log('📊 Cantidad de mock:', this.clientesFiltrados.length);
  }

  // ==========================================
  // BUSCAR CLIENTES
  // ==========================================
  onBuscar(filtros: { dni: string; nombre: string }): void {
    console.log('🔍 Buscando clientes con filtros:', filtros);
    console.log('🔍 DNI:', filtros.dni, '| Nombre:', filtros.nombre);

    // Si ambos filtros están vacíos, cargar todos
    if (!filtros.dni && !filtros.nombre) {
      console.log('ℹ️ Filtros vacíos, cargando todos los clientes');
      this.cargarTodosLosClientes();
      return;
    }

    console.log('📡 Haciendo petición GET a: http://localhost:8080/clientes/buscar');
    this.cargando = true;
    console.log('⏳ cargando = true');

    this.clientesService
      .buscarClientes(filtros.dni, filtros.nombre)
      .pipe(
        finalize(() => {
          this.cargando = false;
          console.log('🏁 Finalizó búsqueda - cargando = false');
        }),
      )
      .subscribe({
        next: (clientes) => {
          console.log('✅ Resultados de búsqueda:', clientes);
          console.log('📊 Cantidad de resultados:', clientes?.length);
          this.clientesFiltrados = clientes || [];
          console.log('📋 clientesFiltrados actualizado con búsqueda:', this.clientesFiltrados);
        },
        error: (error) => {
          console.error('❌ Error al buscar clientes:', error);
          console.error('❌ Detalle del error:', JSON.stringify(error, null, 2));
          this.clientesFiltrados = [];
          console.log('📋 clientesFiltrados vacío por error en búsqueda');
        },
      });
  }

  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================
  onLimpiar(): void {
    console.log('🧹 Limpiando filtros - recargando todos los clientes');
    this.cargarTodosLosClientes();
  }

  // ==========================================
  // SELECCIONAR CLIENTE
  // ==========================================
  onSeleccionarCliente(cliente: ClientesInterface): void {
    console.log('👤 Cliente seleccionado:', cliente);
    console.log('👤 ID:', cliente.id);
    console.log('👤 Nombre completo:', cliente.nombre, cliente.apellido);
    console.log('👤 DNI:', cliente.dni);
    // Aquí puedes emitir el cliente a otro componente
    // o guardarlo en un servicio
  }

  // ==========================================
  // CLIENTE CREADO
  // ==========================================
  onClienteCreado(): void {
    console.log('🆕 Cliente creado correctamente, recargando lista...');
    this.cargarTodosLosClientes();
  }
}

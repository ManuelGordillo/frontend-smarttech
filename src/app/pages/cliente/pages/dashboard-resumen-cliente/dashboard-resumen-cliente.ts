import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasCliente } from './estadisticas-cliente/estadisticas-cliente';
import { UltimaCompra } from './ultima-compra/ultima-compra';
import { AccesosRapidos } from './accesos-rapidos/accesos-rapidos';
import { Router } from '@angular/router';
import { VentasService } from '../../../../services/ventas.service';

@Component({
  selector: 'app-dashboard-resumen-cliente',
  imports: [CommonModule, EstadisticasCliente, UltimaCompra, AccesosRapidos],
  templateUrl: './dashboard-resumen-cliente.html',
})
export default class DashboardResumenCliente implements OnInit {
  private router = inject(Router);
  private ventasService = inject(VentasService);

  // Datos del cliente
  nombreCliente: string = '';
  clienteId: number = 0;

  // Estadísticas
  totalCompras: number = 0;
  totalGastado: number = 0;
  pedidosPendientes: number = 0;
  productosCarrito: number = 0;

  // Última compra
  ultimaCompra: any = null;

  // Productos recomendados
  productosRecomendados: any[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // 🔥 Obtener el ID del cliente desde localStorage
    // Puede venir como 'clienteId', 'usuarioId', o 'id'
    const clienteId =
      localStorage.getItem('clienteId') ||
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('id') ||
      '0';

    this.clienteId = Number(clienteId);
    console.log('🔍 ID del cliente/usuario:', this.clienteId);

    // 🔥 Obtener nombre del cliente
    this.nombreCliente =
      localStorage.getItem('nombreVendedor') ||
      localStorage.getItem('nombre') ||
      localStorage.getItem('nombreUsuario') ||
      localStorage.getItem('nombreCliente') ||
      'Cliente';

    // 🔥 Cargar ventas del cliente
    this.cargarVentasCliente();
  }

  cargarVentasCliente(): void {
    this.ventasService.getVentas().subscribe({
      next: (data: any) => {
        let ventas = Array.isArray(data) ? data : data.content || data.data || [];

        // ✅ FILTRAR POR CLIENTE (NO POR USUARIO)
        const ventasCliente = ventas.filter((v: any) => {
          // El cliente puede estar en v.cliente.id o v.id_cliente
          const idClienteVenta = v.cliente?.id || v.id_cliente;
          return idClienteVenta === this.clienteId;
        });

        console.log('📊 Ventas del cliente:', ventasCliente.length);
        console.log('📊 Datos:', ventasCliente);

        if (ventasCliente.length === 0) {
          console.warn('⚠️ No se encontraron ventas para el cliente ID:', this.clienteId);

          // ✅ BUSCAR VENTAS POR USUARIO (fallback)
          this.buscarVentasPorUsuario(ventas);
          return;
        }

        this.procesarVentasCliente(ventasCliente, ventas);
      },
      error: (error) => {
        console.error('❌ Error al cargar ventas:', error);
      },
    });
  }

  // ✅ FALLBACK: Buscar ventas por usuario
  buscarVentasPorUsuario(ventas: any[]): void {
    const usuarioId = localStorage.getItem('usuarioId') || localStorage.getItem('id');

    if (usuarioId) {
      const ventasPorUsuario = ventas.filter((v: any) => {
        const idUsuarioVenta = v.usuario?.id || v.id_usuario;
        return idUsuarioVenta === Number(usuarioId);
      });

      console.log('📊 Ventas por usuario:', ventasPorUsuario.length);

      if (ventasPorUsuario.length > 0) {
        this.procesarVentasCliente(ventasPorUsuario, ventas);
        return;
      }
    }

    // ✅ Si no hay ventas, mostrar dashboard vacío
    this.mostrarDashboardVacio();
  }

  procesarVentasCliente(ventasCliente: any[], todasLasVentas: any[]): void {
    // ✅ Calcular estadísticas
    this.totalCompras = ventasCliente.length;
    this.totalGastado = ventasCliente.reduce((sum: number, v: any) => sum + (v.total || 0), 0);
    this.pedidosPendientes = ventasCliente.filter(
      (v: any) => v.estado?.toUpperCase() === 'PENDIENTE',
    ).length;

    // ✅ Última compra
    const ventasOrdenadas = [...ventasCliente].sort((a: any, b: any) => {
      const fechaA = new Date(a.fechaVenta || a.fecha_venta);
      const fechaB = new Date(b.fechaVenta || b.fecha_venta);
      return fechaB.getTime() - fechaA.getTime();
    });

    if (ventasOrdenadas.length > 0) {
      const ultima = ventasOrdenadas[0];
      this.ultimaCompra = {
        id: ultima.id || 'N/A',
        fecha: ultima.fechaVenta || ultima.fecha_venta || new Date(),
        estado: ultima.estado || 'Completado',
        total: ultima.total || 0,
        productos: ultima.detalles?.map((d: any) => ({
          id: d.producto?.id || d.id_producto,
          nombre: `${d.producto?.marca || ''} ${d.producto?.modelo || ''}`.trim() || 'Producto',
          precio: d.precio_unitario || d.precio || d.subtotal || 0,
        })) || [{ id: 1, nombre: 'Producto', precio: ultima.total || 0 }],
      };
    }

    // ✅ Productos recomendados
    this.cargarRecomendaciones(ventasCliente, todasLasVentas);
  }

  mostrarDashboardVacio(): void {
    this.totalCompras = 0;
    this.totalGastado = 0;
    this.pedidosPendientes = 0;
    this.ultimaCompra = null;

    // ✅ Recomendaciones por defecto
    this.productosRecomendados = [
      { id: 1, nombre: 'iPhone 15 Pro', descripcion: 'Alto rendimiento', precio: 4500 },
      { id: 2, nombre: 'Samsung Galaxy S24', descripcion: 'Pantalla AMOLED', precio: 3800 },
      { id: 3, nombre: 'Xiaomi Redmi Note 14', descripcion: 'Económico', precio: 1200 },
    ];
  }

  cargarRecomendaciones(ventasCliente: any[], todasLasVentas: any[]): void {
    // 🔥 Productos que el cliente ya compró
    const productosComprados = new Set<number>();
    ventasCliente.forEach((v: any) => {
      const detalles = v.detalles || [];
      detalles.forEach((d: any) => {
        if (d.producto?.id) {
          productosComprados.add(d.producto.id);
        }
      });
    });

    // 🔥 Productos más vendidos (recomendaciones)
    const productosVendidos: Map<number, any> = new Map();

    todasLasVentas.forEach((v: any) => {
      const detalles = v.detalles || [];
      detalles.forEach((d: any) => {
        const producto = d.producto;
        if (producto?.id && !productosComprados.has(producto.id)) {
          if (!productosVendidos.has(producto.id)) {
            productosVendidos.set(producto.id, {
              id: producto.id,
              nombre: `${producto.marca || ''} ${producto.modelo || ''}`.trim() || 'Producto',
              descripcion: producto.descripcion || producto.categoria || '',
              precio: producto.precio || 0,
              totalVendido: 0,
            });
          }
          const p = productosVendidos.get(producto.id);
          if (p) {
            p.totalVendido += d.cantidad || 0;
          }
        }
      });
    });

    // Si hay productos recomendados, mostrar top 3
    if (productosVendidos.size > 0) {
      this.productosRecomendados = Array.from(productosVendidos.values())
        .sort((a, b) => b.totalVendido - a.totalVendido)
        .slice(0, 3);
    } else {
      // Si no hay recomendaciones, mostrar productos por defecto
      this.productosRecomendados = [
        { id: 1, nombre: 'iPhone 15 Pro', descripcion: 'Alto rendimiento', precio: 4500 },
        { id: 2, nombre: 'Samsung Galaxy S24', descripcion: 'Pantalla AMOLED', precio: 3800 },
        { id: 3, nombre: 'Xiaomi Redmi Note 14', descripcion: 'Económico', precio: 1200 },
      ];
    }
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }
}

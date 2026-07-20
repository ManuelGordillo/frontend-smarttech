import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VentasService } from '../../../../services/ventas.service';

@Component({
  selector: 'app-historial-de-compras',
  imports: [CommonModule],
  templateUrl: './historial-de-compras.html',
})
export default class HistorialDeCompras implements OnInit {
  private ventasService = inject(VentasService);
  private router = inject(Router);

  // Lista de compras
  compras: any[] = [];
  loading: boolean = true;

  // ID del cliente
  clienteId: number = 0;

  ngOnInit(): void {
    this.cargarDatosCliente();
    this.cargarHistorial();
  }

  cargarDatosCliente(): void {
    const clienteId =
      localStorage.getItem('clienteId') ||
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('id') ||
      '0';
    this.clienteId = Number(clienteId);
    console.log('🔍 ID del cliente:', this.clienteId);
  }

  cargarHistorial(): void {
    this.loading = true;
    this.ventasService.getVentas().subscribe({
      next: (data: any) => {
        let ventas = Array.isArray(data) ? data : data.content || data.data || [];

        // Filtrar por cliente
        const ventasCliente = ventas.filter((v: any) => {
          const idClienteVenta = v.cliente?.id || v.id_cliente;
          return idClienteVenta === this.clienteId;
        });

        console.log('📊 Ventas del cliente:', ventasCliente.length);

        // Procesar y ordenar por fecha (más reciente primero)
        this.compras = ventasCliente
          .map((venta: any) => this.procesarVenta(venta))
          .sort((a: any, b: any) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return fechaB.getTime() - fechaA.getTime();
          });

        this.loading = false;
        console.log('📋 Historial procesado:', this.compras.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar historial:', error);
        this.loading = false;
        this.compras = [];
      },
    });
  }

  procesarVenta(venta: any): any {
    // Formatear fecha
    const fecha = new Date(venta.fechaVenta || venta.fecha_venta);

    // Calcular total de productos
    const totalProductos =
      venta.detalles?.reduce((sum: number, d: any) => sum + (d.cantidad || 0), 0) || 0;

    // Formatear productos
    const productos =
      venta.detalles?.map((d: any) => ({
        nombre: `${d.producto?.marca || ''} ${d.producto?.modelo || ''}`.trim() || 'Producto',
        cantidad: d.cantidad || 0,
        precio: d.precio_unitario || d.precio || 0,
        subtotal: d.subtotal || 0,
      })) || [];

    return {
      id: venta.id,
      numero: `SMT-${String(venta.id).padStart(4, '0')}`,
      fecha: fecha,
      fechaFormateada: fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      estado: venta.estado || 'PENDIENTE',
      total: venta.total || 0,
      totalProductos: totalProductos,
      productos: productos,
      tipoPago: venta.tipoPago || 'No especificado',
      tipoEntrega: venta.tipoEntrega || 'ENVIO',
    };
  }

  // Obtener clase del badge según estado
  getBadgeClass(estado: string): string {
    const estadoUpper = estado?.toUpperCase() || '';
    switch (estadoUpper) {
      case 'COMPLETADO':
      case 'ENTREGADO':
        return 'badge-success';
      case 'PENDIENTE':
        return 'badge-warning';
      case 'EN CAMINO':
      case 'ENVIADO':
        return 'badge-info';
      case 'CANCELADO':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  }

  // Obtener texto del estado en español
  getEstadoTexto(estado: string): string {
    const estadoUpper = estado?.toUpperCase() || '';
    switch (estadoUpper) {
      case 'COMPLETADO':
        return 'Entregado';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN CAMINO':
        return 'En camino';
      case 'ENVIADO':
        return 'Enviado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return estado || 'Pendiente';
    }
  }

  // Ver detalle de compra
  verDetalle(id: number): void {
    this.router.navigate([`/cliente/dashboard-cliente/historial-de-compras/detalle/${id}`]);
  }

  // Descargar comprobante (simulado)
  descargarComprobante(id: number): void {
    alert(`📄 Descargando comprobante de la orden #SMT-${String(id).padStart(4, '0')}`);
    // Aquí iría la lógica de descarga
  }

  // Recargar historial
  recargar(): void {
    this.cargarHistorial();
  }
}

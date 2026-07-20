import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'dashboard-resumen-productos-ventas',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dashboard-resumen-productos-ventas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardResumenProductosVentas implements OnChanges {
  @Input() ventas: any[] = [];

  // Productos más vendidos
  topProductos: any[] = [];

  // Últimas ventas
  ultimasVentas: any[] = [];

  // Colores para las barras de progreso
  colores: string[] = [
    'progress-primary',
    'progress-success',
    'progress-warning',
    'progress-info',
    'progress-error',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas'] && this.ventas) {
      this.procesarTopProductos();
      this.procesarUltimasVentas();
    }
  }

  procesarTopProductos(): void {
    // Agrupar productos por ID
    const productosMap = new Map<number, any>();

    this.ventas.forEach((venta: any) => {
      const detalles = venta.detalles || [];
      detalles.forEach((detalle: any) => {
        const producto = detalle.producto;
        if (producto && producto.id) {
          if (!productosMap.has(producto.id)) {
            productosMap.set(producto.id, {
              id: producto.id,
              nombre: producto.modelo || 'Producto',
              marca: producto.marca || '-',
              cantidad: 0,
              precio: producto.precio || 0,
            });
          }
          const item = productosMap.get(producto.id);
          item.cantidad += detalle.cantidad || 0;
        }
      });
    });

    // Calcular total de productos vendidos
    const totalProductos = Array.from(productosMap.values()).reduce(
      (sum, p) => sum + p.cantidad,
      0,
    );

    // Ordenar y calcular porcentajes
    this.topProductos = Array.from(productosMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
      .map((producto, index) => ({
        ...producto,
        porcentaje: totalProductos > 0 ? (producto.cantidad / totalProductos) * 100 : 0,
        color: this.colores[index % this.colores.length],
      }));

    console.log('🏆 Top productos:', this.topProductos);
  }

  procesarUltimasVentas(): void {
    // Tomar las últimas 5 ventas
    const ventasRecientes = [...this.ventas]
      .sort((a, b) => {
        const fechaA = new Date(a.fechaVenta || a.fecha_venta);
        const fechaB = new Date(b.fechaVenta || b.fecha_venta);
        return fechaB.getTime() - fechaA.getTime();
      })
      .slice(0, 5);

    this.ultimasVentas = ventasRecientes.map((venta: any) => ({
      id: venta.id,
      cliente: venta.cliente?.nombre || '-',
      producto: venta.detalles?.[0]?.producto?.modelo || '-',
      total: venta.total || 0,
      estado: venta.estado || 'COMPLETADO',
      fecha: new Date(venta.fechaVenta || venta.fecha_venta),
    }));

    console.log('📋 Últimas ventas:', this.ultimasVentas);
  }

  getBadgeClass(estado: string): string {
    const estadoLower = estado?.toLowerCase() || '';
    switch (estadoLower) {
      case 'completado':
      case 'completada':
        return 'badge-success';
      case 'pendiente':
        return 'badge-warning';
      case 'anulado':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reporte-ranking-productos',
  imports: [CommonModule],
  templateUrl: './reporte-ranking-productos.html',
})
export class ReporteRankingProductos implements OnChanges {
  @Input() ventas: any[] = [];

  ranking: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas'] && this.ventas) {
      this.procesarRanking();
    }
  }

  procesarRanking(): void {
    const productosMap = new Map<number, any>();

    this.ventas.forEach((venta: any) => {
      const detalles = venta.detalles || [];
      detalles.forEach((detalle: any) => {
        const producto = detalle.producto;
        if (producto && producto.id) {
          if (!productosMap.has(producto.id)) {
            productosMap.set(producto.id, {
              id: producto.id,
              nombre: `${producto.marca} ${producto.modelo}`,
              marca: producto.marca || '-',
              modelo: producto.modelo || '-',
              cantidad: 0,
              ingresos: 0,
              precio: producto.precio || 0,
              stock: producto.stock || 0,
            });
          }
          const item = productosMap.get(producto.id);
          item.cantidad += detalle.cantidad || 0;
          item.ingresos += detalle.subtotal || 0;
        }
      });
    });

    this.ranking = Array.from(productosMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        posicion: index + 1,
      }));
  }
}

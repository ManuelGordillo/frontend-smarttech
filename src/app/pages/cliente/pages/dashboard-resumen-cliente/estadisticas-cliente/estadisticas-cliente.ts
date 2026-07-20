import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'smarttech-estadisticas-cliente',
  imports: [CommonModule],
  templateUrl: './estadisticas-cliente.html',
})
export class EstadisticasCliente implements OnChanges {
  @Input() totalCompras: number = 0;
  @Input() totalGastado: number = 0;
  @Input() pedidosPendientes: number = 0;
  @Input() productosCarrito: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('📊 Estadísticas cliente:', {
      totalCompras: this.totalCompras,
      totalGastado: this.totalGastado,
      pedidosPendientes: this.pedidosPendientes,
      productosCarrito: this.productosCarrito,
    });
  }
}

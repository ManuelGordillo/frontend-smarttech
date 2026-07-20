import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reporte-kpis',
  imports: [CommonModule],
  templateUrl: './reporte-kpis.html',
})
export class ReporteKpis implements OnChanges {
  @Input() datos: any = {};

  ingresosTotales: number = 0;
  ventasRealizadas: number = 0;
  productosVendidos: number = 0;
  ticketPromedio: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      this.ingresosTotales = this.datos.ingresosTotales || 0;
      this.ventasRealizadas = this.datos.ventasRealizadas || 0;
      this.productosVendidos = this.datos.productosVendidos || 0;
      this.ticketPromedio = this.datos.ticketPromedio || 0;
    }
  }
}

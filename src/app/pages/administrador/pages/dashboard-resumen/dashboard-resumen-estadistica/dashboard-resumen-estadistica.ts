import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dashboard-resumen-estadistica',
  imports: [CommonModule],
  templateUrl: './dashboard-resumen-estadistica.html',
})
export class DashboardResumenEstadistica implements OnChanges {
  @Input() datos: any = {};

  ventasHoy: number = 0;
  ventasMes: number = 0;
  totalClientes: number = 0;
  totalProductos: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      this.ventasHoy = this.datos.ventasHoy || 0;
      this.ventasMes = this.datos.ventasMes || 0;
      this.totalClientes = this.datos.totalClientes || 0;
      this.totalProductos = this.datos.totalProductos || 0;
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'smarttech-historial-ventas-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-ventas-resumen.html',
})
export class HistorialVentasResumen implements OnChanges {
  @Input() ventas: any[] = [];

  ventasHoy: number = 0;
  ventasMes: number = 0;
  totalVendido: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas']) {
      // ✅ VERIFICAR QUE SEA UN ARRAY
      if (!this.ventas || !Array.isArray(this.ventas)) {
        console.warn('⚠️ ventas no es un array:', this.ventas);
        this.ventasHoy = 0;
        this.ventasMes = 0;
        this.totalVendido = 0;
        return;
      }
      this.calcularResumen();
    }
  }

  calcularResumen(): void {
    // ✅ ASEGURAR QUE ventas SEA UN ARRAY
    if (!this.ventas || !Array.isArray(this.ventas) || this.ventas.length === 0) {
      this.ventasHoy = 0;
      this.ventasMes = 0;
      this.totalVendido = 0;
      return;
    }

    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Ventas de hoy
    this.ventasHoy = this.ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha_venta || venta.fechaVenta);
      return fechaVenta.toDateString() === hoy.toDateString();
    }).length;

    // Ventas del mes
    this.ventasMes = this.ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha_venta || venta.fechaVenta);
      return fechaVenta >= inicioMes && fechaVenta <= hoy;
    }).length;

    // Total vendido
    this.totalVendido = this.ventas.reduce((sum, venta) => {
      return sum + (venta.total || 0);
    }, 0);
  }
}

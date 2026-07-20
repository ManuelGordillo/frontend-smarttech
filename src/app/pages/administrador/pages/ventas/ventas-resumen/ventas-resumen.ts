import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'smarttech-ventas-resumen',
  imports: [CommonModule],
  templateUrl: './ventas-resumen.html',
})
export class VentasResumen {
  @Input() ventas: any[] = [];

  ventasHoy: number = 0;
  ventasMes: number = 0;
  productosVendidos: number = 0;
  ventasGeneradas: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas']) {
      // ✅ VERIFICAR QUE SEA UN ARRAY
      if (!this.ventas || !Array.isArray(this.ventas)) {
        console.warn('⚠️ ventas no es un array:', this.ventas);
        this.ventasHoy = 0;
        this.ventasMes = 0;
        this.productosVendidos = 0;
        this.ventasGeneradas = 0;
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
      this.productosVendidos = 0;
      this.ventasGeneradas = 0;
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

    // Total de productos vendidos y ventas generadas
    this.productosVendidos = this.ventas.length;
    this.ventasGeneradas = this.ventas.length;
  }
}

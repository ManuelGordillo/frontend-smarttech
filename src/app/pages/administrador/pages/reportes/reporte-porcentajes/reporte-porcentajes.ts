import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reporte-porcentajes',
  imports: [CommonModule],
  templateUrl: './reporte-porcentajes.html',
})
export class ReportePorcentajes implements OnChanges {
  @Input() ventas: any[] = [];

  marcas: any[] = [];
  totalProductos: number = 0;

  // Colores para las barras
  colores: string[] = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas'] && this.ventas) {
      this.procesarPorcentajes();
    }
  }

  procesarPorcentajes(): void {
    // ✅ CONTAR PRODUCTOS POR MARCA
    const marcasMap: { [key: string]: number } = {};

    this.ventas.forEach((venta: any) => {
      const detalles = venta.detalles || [];
      detalles.forEach((detalle: any) => {
        const marca = detalle.producto?.marca || 'Sin marca';
        marcasMap[marca] = (marcasMap[marca] || 0) + (detalle.cantidad || 0);
      });
    });

    // ✅ CALCULAR TOTAL
    this.totalProductos = Object.values(marcasMap).reduce((sum, cantidad) => sum + cantidad, 0);

    // ✅ CREAR ARRAY CON PORCENTAJES
    this.marcas = Object.entries(marcasMap)
      .map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
        porcentaje: this.totalProductos > 0 ? (cantidad / this.totalProductos) * 100 : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  // ✅ OBTENER COLOR SEGÚN ÍNDICE
  getColor(index: number): string {
    return this.colores[index % this.colores.length];
  }
}

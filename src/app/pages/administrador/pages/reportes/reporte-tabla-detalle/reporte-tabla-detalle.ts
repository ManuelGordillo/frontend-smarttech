import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'reporte-tabla-detalle',
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './reporte-tabla-detalle.html',
})
export class ReporteTablaDetalle implements OnChanges {
  @Input() ventas: any[] = [];

  datosTabla: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas'] && this.ventas) {
      this.procesarDatos();
    }
  }

  procesarDatos(): void {
    this.datosTabla = this.ventas.map((venta: any) => ({
      id: venta.id,
      fecha: venta.fechaVenta || venta.fecha_venta,
      cliente: venta.cliente?.nombre || '-',
      vendedor: venta.usuario?.nombreUsuario || '-',
      marca: venta.detalles?.[0]?.producto?.marca || '-',
      modelo: venta.detalles?.[0]?.producto?.modelo || '-',
      cantidad: venta.detalles?.[0]?.cantidad || 0,
      total: venta.total || 0,
      estado: venta.estado || 'COMPLETADO',
    }));
  }
}

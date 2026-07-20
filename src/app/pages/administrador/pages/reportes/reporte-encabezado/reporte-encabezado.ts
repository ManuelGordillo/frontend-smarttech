import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'reporte-encabezado',
  imports: [CommonModule],
  templateUrl: './reporte-encabezado.html',
})
export class ReporteEncabezado {
  @Input() ventas: any[] = [];

  exportarExcel(): void {
    this.exportarCSV();
  }

  exportarPDF(): void {
    if (!this.ventas || this.ventas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF('landscape'); // Horizontal para más columnas

    // Título
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total de ventas: ${this.ventas.length}`, 14, 37);

    // Cabeceras
    const headers = [
      'N° Venta',
      'Fecha',
      'Cliente',
      'Vendedor',
      'Marca',
      'Modelo',
      'Cantidad',
      'Total',
    ];

    // Filas
    const rows = this.ventas.map((venta: any) => [
      venta.id.toString(),
      new Date(venta.fechaVenta || venta.fecha_venta).toLocaleDateString(),
      venta.cliente?.nombre || '-',
      venta.usuario?.nombreUsuario || venta.usuario?.nombre || '-',
      venta.detalles?.[0]?.producto?.marca || '-',
      venta.detalles?.[0]?.producto?.modelo || '-',
      (venta.detalles?.[0]?.cantidad || 0).toString(),
      `S/ ${(venta.total || 0).toFixed(2)}`,
    ]);

    // Generar tabla
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 42,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        6: { cellWidth: 25, halign: 'center' },
        7: { cellWidth: 30, halign: 'right' },
      },
    });

    // Guardar
    doc.save(`reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private exportarCSV(): void {
    if (!this.ventas || this.ventas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Cabeceras
    const headers = [
      'N° Venta',
      'Fecha',
      'Cliente',
      'Vendedor',
      'Marca',
      'Modelo',
      'Cantidad',
      'Total',
    ];

    // Filas
    const rows = this.ventas.map((venta: any) => [
      venta.id,
      new Date(venta.fechaVenta || venta.fecha_venta).toLocaleDateString(),
      venta.cliente?.nombre || '-',
      venta.usuario?.nombreUsuario || venta.usuario?.nombre || '-',
      venta.detalles?.[0]?.producto?.marca || '-',
      venta.detalles?.[0]?.producto?.modelo || '-',
      venta.detalles?.[0]?.cantidad || 0,
      venta.total || 0,
    ]);

    // Crear CSV
    let csv = headers.join(',') + '\n';
    rows.forEach((row) => {
      csv += row.join(',') + '\n';
    });

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }
}

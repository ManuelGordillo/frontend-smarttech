import { Component, inject } from '@angular/core';
import { ReporteEncabezado } from './reporte-encabezado/reporte-encabezado';
import { ReporteKpis } from './reporte-kpis/reporte-kpis';
import { ReporteFiltros } from './reporte-filtros/reporte-filtros';
import { ReporteGraficos } from './reporte-graficos/reporte-graficos';
import { ReportePorcentajes } from './reporte-porcentajes/reporte-porcentajes';
import { ReporteRankingProductos } from './reporte-ranking-productos/reporte-ranking-productos';
import { ReporteTablaDetalle } from './reporte-tabla-detalle/reporte-tabla-detalle';
import { VentasService } from '../../../../services/ventas.service';

@Component({
  selector: 'app-reportes',
  imports: [
    ReporteEncabezado,
    ReporteKpis,
    ReporteFiltros,
    ReporteGraficos,
    ReportePorcentajes,
    ReporteRankingProductos,
    ReporteTablaDetalle,
  ],
  templateUrl: './reportes.html',
})
export default class Reportes {
  private ventasService = inject(VentasService);

  datosKpis = {
    ingresosTotales: 0,
    ventasRealizadas: 0,
    productosVendidos: 0,
    ticketPromedio: 0,
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.ventasService.getVentas().subscribe({
      next: (data: any) => {
        console.log('✅ Datos de ventas para reportes:', data);

        // Asegurar que sea un array
        let ventas = Array.isArray(data) ? data : data.content || data.data || [];

        // Filtrar ventas con detalles
        const ventasConDetalles = ventas.filter((v: any) => v.detalles && v.detalles.length > 0);

        console.log('📊 Ventas con detalles:', ventasConDetalles.length);

        // ✅ PROCESAR KPIs
        this.procesarKpis(ventasConDetalles);
      },
      error: (error) => {
        console.error('❌ Error al cargar ventas:', error);
      },
    });
  }

  procesarKpis(ventas: any[]): void {
    let totalIngresos = 0;
    let totalProductos = 0;

    ventas.forEach((venta: any) => {
      totalIngresos += venta.total || 0;
      const detalles = venta.detalles || [];
      detalles.forEach((detalle: any) => {
        totalProductos += detalle.cantidad || 0;
      });
    });

    this.datosKpis = {
      ingresosTotales: totalIngresos,
      ventasRealizadas: ventas.length,
      productosVendidos: totalProductos,
      ticketPromedio: ventas.length > 0 ? totalIngresos / ventas.length : 0,
    };

    console.log('📊 KPIs actualizados:', this.datosKpis);
  }
}

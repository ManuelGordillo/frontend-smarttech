import { Component, inject, OnInit } from '@angular/core';
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
export default class Reportes implements OnInit {
  // ← Agregar OnInit
  private ventasService = inject(VentasService);

  datosKpis = {
    ingresosTotales: 0,
    ventasRealizadas: 0,
    productosVendidos: 0,
    ticketPromedio: 0,
  };

  todasLasVentas: any[] = [];
  ventasFiltradas: any[] = [];

  ngOnInit(): void {
    this.cargarDatos(); // ✅ Sin parámetros al inicio
  }

  // ✅ FILTROS OPCIONALES con valor por defecto
  // cargarDatos(filtros?: any): void {
  //   // ← Agregar ? para opcional
  //   this.ventasService.getVentas().subscribe({
  //     next: (data: any) => {
  //       console.log('✅ Datos de ventas para reportes:', data);

  //       let ventas = Array.isArray(data) ? data : data.content || data.data || [];
  //       this.todasLasVentas = ventas;

  //       // ✅ APLICAR FILTROS SI EXISTEN
  //       const ventasFiltradas = this.aplicarFiltros(ventas, filtros);

  //       // Filtrar ventas con detalles
  //       const ventasConDetalles = ventasFiltradas.filter(
  //         (v: any) => v.detalles && v.detalles.length > 0,
  //       );

  //       console.log('📊 Ventas con detalles:', ventasConDetalles.length);

  //       // ✅ PROCESAR KPIs
  //       this.procesarKpis(ventasConDetalles);
  //     },
  //     error: (error) => {
  //       console.error('❌ Error al cargar ventas:', error);
  //     },
  //   });
  // }
  cargarDatos(filtros?: any): void {
    this.ventasService.getVentas().subscribe({
      next: (data: any) => {
        console.log('✅ Datos de ventas para reportes:', data);

        let ventas = Array.isArray(data) ? data : data.content || data.data || [];
        this.todasLasVentas = ventas;

        // ✅ APLICAR FILTROS SI EXISTEN
        const ventasFiltradas = this.aplicarFiltros(ventas, filtros);

        // ✅ ASIGNAR A ventasFiltradas
        this.ventasFiltradas = ventasFiltradas;

        console.log('📊 ventasFiltradas:', this.ventasFiltradas);
        console.log('📊 ventasFiltradas length:', this.ventasFiltradas.length);

        // Filtrar ventas con detalles
        const ventasConDetalles = ventasFiltradas.filter(
          (v: any) => v.detalles && v.detalles.length > 0,
        );

        console.log('📊 Ventas con detalles:', ventasConDetalles.length);

        this.procesarKpis(ventasConDetalles);
      },
      error: (error) => {
        console.error('❌ Error al cargar ventas:', error);
      },
    });
  }

  // ✅ APLICAR FILTROS
  aplicarFiltros(ventas: any[], filtros?: any): any[] {
    if (!filtros) return ventas;

    let resultado = [...ventas];

    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      resultado = resultado.filter((v: any) => {
        const fechaVenta = new Date(v.fechaVenta || v.fecha_venta);
        return fechaVenta >= fechaInicio;
      });
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      resultado = resultado.filter((v: any) => {
        const fechaVenta = new Date(v.fechaVenta || v.fecha_venta);
        return fechaVenta <= fechaFin;
      });
    }

    if (filtros.marca) {
      resultado = resultado.filter((v: any) => {
        const marca = v.detalles?.[0]?.producto?.marca?.toLowerCase() || '';
        return marca.includes(filtros.marca.toLowerCase());
      });
    }

    if (filtros.modelo) {
      resultado = resultado.filter((v: any) => {
        const modelo = v.detalles?.[0]?.producto?.modelo?.toLowerCase() || '';
        return modelo.includes(filtros.modelo.toLowerCase());
      });
    }

    return resultado;
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

  // ✅ RECIBIR FILTROS DESDE EL HIJO
  aplicarFiltrosDesdeHijo(filtros: any): void {
    console.log('📋 Filtros recibidos:', filtros);
    this.cargarDatos(filtros);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardResumenEncabezado } from './dashboard-resumen-encabezado/dashboard-resumen-encabezado';
import { DashboardResumenEstadistica } from './dashboard-resumen-estadistica/dashboard-resumen-estadistica';
import { DashboardResumenGraficos } from './dashboard-resumen-graficos/dashboard-resumen-graficos';
import { DashboardResumenProductosVentas } from './dashboard-resumen-productos-ventas/dashboard-resumen-productos-ventas';
import { VentasService } from '../../../../services/ventas.service';

@Component({
  selector: 'app-dashboard-resumen',
  imports: [
    CommonModule,
    DashboardResumenEncabezado,
    DashboardResumenEstadistica,
    DashboardResumenGraficos,
    DashboardResumenProductosVentas,
  ],
  templateUrl: './dashboard-resumen.html',
})
export default class DashboardResumen implements OnInit {
  private ventasService = inject(VentasService);

  datosEstadisticas = {
    ventasHoy: 0,
    ventasMes: 0,
    totalClientes: 0,
    totalProductos: 0,
  };

  datosGraficos: any[] = [];
  objetivoMensual: number = 108000;
  totalVentasMes: number = 0;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.ventasService.getVentas().subscribe({
      next: (data: any) => {
        let ventas = Array.isArray(data) ? data : data.content || data.data || [];
        ventas = ventas.filter((v: any) => v.detalles && v.detalles.length > 0);

        console.log('📊 Ventas con detalles:', ventas.length);
        console.log('📊 Datos:', ventas);

        this.procesarEstadisticas(ventas);
        this.procesarGraficos(ventas);
      },
      error: (error) => {
        console.error('❌ Error al cargar datos:', error);
      },
    });
  }

  procesarEstadisticas(ventas: any[]): void {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // ✅ FILTRAR VENTAS DE HOY
    const ventasHoy = ventas.filter((v: any) => {
      const fecha = new Date(v.fechaVenta || v.fecha_venta);
      return fecha.toDateString() === hoy.toDateString();
    });
    console.log('📊 Ventas de hoy:', ventasHoy.length);

    // ✅ FILTRAR VENTAS DEL MES
    const ventasMes = ventas.filter((v: any) => {
      const fecha = new Date(v.fechaVenta || v.fecha_venta);
      return fecha >= inicioMes && fecha <= hoy;
    });
    console.log('📊 Ventas del mes:', ventasMes.length);

    // ✅ TOTAL DE INGRESOS
    const totalHoy = ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0);
    const totalMes = ventasMes.reduce((sum, v) => sum + (v.total || 0), 0);
    console.log('💰 Total hoy:', totalHoy);
    console.log('💰 Total mes:', totalMes);

    // ✅ CLIENTES ÚNICOS (los que compraron)
    const clientes = new Set();
    ventas.forEach((v: any) => {
      if (v.cliente?.id) clientes.add(v.cliente.id);
    });
    console.log('👥 Clientes únicos:', clientes.size);

    // ✅ CONTAR TODOS LOS PRODUCTOS VENDIDOS (incluyendo duplicados)
    let totalProductosVendidos = 0;
    ventas.forEach((v: any) => {
      const detalles = v.detalles || [];
      detalles.forEach((d: any) => {
        totalProductosVendidos += d.cantidad || 0;
      });
    });
    console.log('📦 Productos vendidos total:', totalProductosVendidos);

    this.datosEstadisticas = {
      ventasHoy: totalHoy,
      ventasMes: totalMes,
      totalClientes: clientes.size,
      totalProductos: totalProductosVendidos, // ✅ Ahora cuenta TODOS los productos
    };

    this.totalVentasMes = totalMes;
  }

  procesarGraficos(ventas: any[]): void {
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const ventasPorMes: { [key: string]: number } = {};

    ventas.forEach((venta: any) => {
      const fecha = new Date(venta.fechaVenta || venta.fecha_venta);
      const mes = meses[fecha.getMonth()];
      ventasPorMes[mes] = (ventasPorMes[mes] || 0) + (venta.total || 0);
    });

    this.datosGraficos = meses.map((mes) => ({
      mes,
      total: ventasPorMes[mes] || 0,
    }));

    console.log('📊 Datos gráficos:', this.datosGraficos);
  }
}

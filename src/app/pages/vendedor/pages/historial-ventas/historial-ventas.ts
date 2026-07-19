import { Component, OnInit, inject } from '@angular/core';
import { HistorialVentasFiltros } from './historial-ventas-filtros/historial-ventas-filtros';
import { HistorialVentasResumen } from './historial-ventas-resumen/historial-ventas-resumen';
import { HistorialVentasTabla } from './historial-ventas-tabla/historial-ventas-tabla';
import { VentasService } from '../../../../services/ventas.service';

@Component({
  selector: 'app-historial-ventas',
  imports: [HistorialVentasFiltros, HistorialVentasResumen, HistorialVentasTabla],
  templateUrl: './historial-ventas.html',
})
export class HistorialVentas implements OnInit {
  private ventasService = inject(VentasService);

  // Datos
  ventasFiltradas: any[] = [];
  cargando = false;

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 5;
  totalItems = 0;

  ngOnInit() {
    this.cargarVentas();
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalItems / this.itemsPorPagina) || 1;
  }

  cargarVentas() {
    this.cargando = true;

    this.ventasService.getVentas().subscribe({
      next: (data) => {
        console.log('✅ Ventas recibidas:', data);
        this.ventasFiltradas = data;
        this.totalItems = data.length;
        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.cargando = false;
      },
    });
  }

  onVerVenta(id: number) {
    console.log('🔍 Ver venta ID:', id);
  }
  aplicarFiltros(filtros: any) {
    console.log('📋 Filtros aplicados:', filtros);
    // Aquí implementarás la lógica de filtrado
    this.paginaActual = 1;
  }
}

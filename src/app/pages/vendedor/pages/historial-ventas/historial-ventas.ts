import { Component } from '@angular/core';
import { HistorialVentasFiltros } from './historial-ventas-filtros/historial-ventas-filtros';
import { HistorialVentasResumen } from './historial-ventas-resumen/historial-ventas-resumen';
import { HistorialVentasTabla } from './historial-ventas-tabla/historial-ventas-tabla';

@Component({
  selector: 'app-historial-ventas',
  imports: [HistorialVentasFiltros, HistorialVentasResumen, HistorialVentasTabla],
  templateUrl: './historial-ventas.html',
})
export class HistorialVentas {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardResumenEncabezado } from './dashboard-resumen-encabezado/dashboard-resumen-encabezado';
import { DashboardResumenEstadistica } from './dashboard-resumen-estadistica/dashboard-resumen-estadistica';
import { DashboardResumenGraficos } from './dashboard-resumen-graficos/dashboard-resumen-graficos';
import { DashboardResumenProductosVentas } from './dashboard-resumen-productos-ventas/dashboard-resumen-productos-ventas';

@Component({
  selector: 'app-dashboard-resumen',
  imports: [
    DashboardResumenEncabezado,
    DashboardResumenEstadistica,
    DashboardResumenGraficos,
    DashboardResumenProductosVentas,
  ],
  templateUrl: './dashboard-resumen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardResumen {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EstadisticasCliente } from './estadisticas-cliente/estadisticas-cliente';
import { UltimaCompra } from './ultima-compra/ultima-compra';
import { AccesosRapidos } from './accesos-rapidos/accesos-rapidos';

@Component({
  selector: 'app-dashboard-resumen-cliente',
  imports: [EstadisticasCliente, UltimaCompra, AccesosRapidos],
  templateUrl: './dashboard-resumen-cliente.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardResumenCliente {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReporteEncabezado } from './reporte-encabezado/reporte-encabezado';
import { ReporteKpis } from './reporte-kpis/reporte-kpis';
import { ReporteFiltros } from './reporte-filtros/reporte-filtros';
import { ReporteGraficos } from './reporte-graficos/reporte-graficos';
import { ReportePorcentajes } from './reporte-porcentajes/reporte-porcentajes';
import { ReporteRankingProductos } from './reporte-ranking-productos/reporte-ranking-productos';
import { ReporteTablaDetalle } from './reporte-tabla-detalle/reporte-tabla-detalle';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Reportes {}

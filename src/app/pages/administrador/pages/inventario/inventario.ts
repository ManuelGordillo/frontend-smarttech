import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InventarioResumen } from './inventario-resumen/inventario-resumen';
import { InventarioFiltros } from './inventario-filtros/inventario-filtros';
import { InventarioTabla } from './inventario-tabla/inventario-tabla';

@Component({
  selector: 'app-inventario',
  imports: [InventarioResumen, InventarioFiltros, InventarioTabla],
  templateUrl: './inventario.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Inventario {}

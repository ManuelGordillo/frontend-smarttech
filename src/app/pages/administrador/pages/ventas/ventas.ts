import { Component } from '@angular/core';
import { VentasResumen } from './ventas-resumen/ventas-resumen';
import { VentasFiltros } from './ventas-filtros/ventas-filtros';
import { VentasTabla } from './ventas-tabla/ventas-tabla';

@Component({
  selector: 'app-ventas',
  imports: [VentasResumen, VentasFiltros, VentasTabla],
  templateUrl: './ventas.html',
})
export default class Ventas {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuevaVenta } from '../dashboard-resumen-vendedor/nueva-venta/nueva-venta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [NuevaVenta, RouterLink],
  templateUrl: './carrito.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrito {}

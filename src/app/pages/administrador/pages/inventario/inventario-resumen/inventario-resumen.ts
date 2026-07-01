// inventario-resumen/inventario-resumen.ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'inventario-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario-resumen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioResumen {
  @Input() totalProductos: number = 0;
  @Input() stockDisponible: number = 0;
  @Input() stockBajo: number = 0;
  @Input() agotados: number = 0;
}

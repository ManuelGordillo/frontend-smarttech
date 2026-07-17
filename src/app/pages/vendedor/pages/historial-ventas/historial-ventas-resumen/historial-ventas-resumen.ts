import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'smarttech-historial-ventas-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-ventas-resumen.html',
})
export class HistorialVentasResumen {
  @Input() ventasHoy: number = 0;

  @Input() ventasMes: number = 0;

  @Input() totalVendido: number = 0;
}

import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'smarttech-historial-ventas-tabla',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './historial-ventas-tabla.html',
})
export class HistorialVentasTabla {
  @Input() ventas: any[] = [];

  @Output() verVenta = new EventEmitter<number>();

  verDetalle(id: number): void {
    this.verVenta.emit(id);
  }
}

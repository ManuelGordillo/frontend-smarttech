import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'smarttech-ventas-tabla',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './ventas-tabla.html',
})
export class VentasTabla {
  @Input() ventas: any[] = [];

  @Output() verVenta = new EventEmitter<number>();
}

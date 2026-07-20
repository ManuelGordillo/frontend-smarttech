import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'smarttech-ventas-tabla',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './ventas-tabla.html',
})
export class VentasTabla {
  @Input() ventas: any[] = [];
  @Output() verVenta = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas'] && this.ventas && this.ventas.length > 0) {
      console.log('🔍 Primera venta:', this.ventas[0]);
      console.log('🔍 Usuario en venta:', this.ventas[0]?.usuario);
      console.log('🔍 Keys de la venta:', Object.keys(this.ventas[0] || {}));
      console.log('🔍 TODA la venta:', JSON.stringify(this.ventas[0], null, 2));
    }
  }
}

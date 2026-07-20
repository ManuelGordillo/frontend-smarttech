import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'smarttech-ultima-compra',
  imports: [CommonModule, DatePipe],
  templateUrl: './ultima-compra.html',
})
export class UltimaCompra implements OnChanges {
  @Input() ultimaCompra: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ultimaCompra'] && this.ultimaCompra) {
      console.log('🛒 Última compra:', this.ultimaCompra);
    }
  }

  getEstadoBadge(estado: string): string {
    const estadoLower = estado?.toLowerCase() || '';
    switch (estadoLower) {
      case 'completado':
      case 'entregado':
        return 'bg-green-100 text-green-700';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'en camino':
      case 'enviado':
        return 'bg-blue-100 text-blue-700';
      case 'cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}

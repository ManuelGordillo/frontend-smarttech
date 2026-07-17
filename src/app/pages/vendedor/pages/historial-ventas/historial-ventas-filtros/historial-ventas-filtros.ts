import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-historial-ventas-filtros',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './historial-ventas-filtros.html',
})
export class HistorialVentasFiltros {
  @Output() buscar = new EventEmitter<{
    numeroVenta: string;
    cliente: string;
    fecha: string;
  }>();

  filtros = {
    numeroVenta: '',
    cliente: '',
    fecha: '',
  };

  buscarVentas(): void {
    this.buscar.emit({ ...this.filtros });
  }

  limpiar(): void {
    this.filtros = {
      numeroVenta: '',
      cliente: '',
      fecha: '',
    };

    this.buscar.emit({ ...this.filtros });
  }
}

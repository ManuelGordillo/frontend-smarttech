import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-ventas-filtros',
  imports: [FormsModule],
  templateUrl: './ventas-filtros.html',
})
export class VentasFiltros {
  @Output() buscar = new EventEmitter<{
    marca: string;
    modelo: string;
    fecha: string;
  }>();

  filtros = {
    marca: '',
    modelo: '',
    fecha: '',
  };

  buscarVentas(): void {
    this.buscar.emit({ ...this.filtros });
  }

  limpiar(): void {
    this.filtros = {
      marca: '',
      modelo: '',
      fecha: '',
    };

    this.buscar.emit({ ...this.filtros });
  }
}

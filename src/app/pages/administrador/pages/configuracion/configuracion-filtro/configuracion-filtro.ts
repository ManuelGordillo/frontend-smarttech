import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'configuracion-filtro',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-filtro.html',
})
export class ConfiguracionFiltro {
  @Output() buscar = new EventEmitter<any>();

  filtros = {
    rol: '',
    busqueda: '',
    estado: '',
  };

  aplicarFiltros(): void {
    console.log('📋 Filtros aplicados:', this.filtros);
    this.buscar.emit(this.filtros);
  }

  limpiarFiltros(): void {
    this.filtros = {
      rol: '',
      busqueda: '',
      estado: '',
    };
    this.buscar.emit(this.filtros);
  }
}

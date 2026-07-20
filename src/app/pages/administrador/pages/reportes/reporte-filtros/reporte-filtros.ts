import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'reporte-filtros',
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-filtros.html',
})
export class ReporteFiltros {
  @Output() buscar = new EventEmitter<any>();

  filtros = {
    fechaInicio: '',
    fechaFin: '',
    marca: '',
    modelo: '',
  };

  aplicarFiltros(): void {
    console.log('📋 Filtros aplicados:', this.filtros);
    this.buscar.emit(this.filtros);
  }

  limpiarFiltros(): void {
    this.filtros = {
      fechaInicio: '',
      fechaFin: '',
      marca: '',
      modelo: '',
    };
    this.buscar.emit(this.filtros);
  }
}

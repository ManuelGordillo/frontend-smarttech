// inventario-filtros/inventario-filtros.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FiltrosInventario {
  marca: string;
  modelo: string;
  estado: string;
  fecha: string;
  color: string; // ✅ Agregar color
}

@Component({
  selector: 'inventario-filtros',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventario-filtros.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventarioFiltros {
  @Input() marcas: string[] = [];
  @Input() colores: string[] = []; // ✅ Lista de colores únicos
  @Output() filtrar = new EventEmitter<FiltrosInventario>();
  @Output() limpiar = new EventEmitter<void>();

  estados: string[] = ['Todos', 'Disponible', 'Agotado', 'Stock Bajo'];

  filtros: FiltrosInventario = {
    marca: '',
    modelo: '',
    estado: 'Todos',
    fecha: '',
    color: '', // ✅ Agregar color
  };

  aplicarFiltros() {
    this.filtrar.emit(this.filtros);
  }

  limpiarFiltros() {
    this.filtros = {
      marca: '',
      modelo: '',
      estado: 'Todos',
      fecha: '',
      color: '',
    };
    this.limpiar.emit();
  }
}

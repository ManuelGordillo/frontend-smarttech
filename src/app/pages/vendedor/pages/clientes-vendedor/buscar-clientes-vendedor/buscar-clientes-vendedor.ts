import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-buscar-clientes-vendedor',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-clientes-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscarClientesVendedor {
  // FILTROS
  filtroDni: string = '';
  filtroNombre: string = '';

  // EMITIR EVENTOS AL PADRE
  @Output() buscar = new EventEmitter<{ dni: string; nombre: string }>();
  @Output() limpiar = new EventEmitter<void>();

  // ==========================================
  // BUSCAR CLIENTES
  // ==========================================
  onBuscar(): void {
    this.buscar.emit({
      dni: this.filtroDni,
      nombre: this.filtroNombre,
    });
  }

  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================
  onLimpiar(): void {
    this.filtroDni = '';
    this.filtroNombre = '';
    this.limpiar.emit();
  }
}

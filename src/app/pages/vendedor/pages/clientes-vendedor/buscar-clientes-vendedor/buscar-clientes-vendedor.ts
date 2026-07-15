// buscar-clientes-vendedor.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-buscar-clientes-vendedor',
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-clientes-vendedor.html',
})
export class BuscarClientesVendedor {
  filtroDni: string = '';
  filtroNombre: string = '';

  @Output() buscar = new EventEmitter<{ dni: string; nombre: string }>();
  @Output() limpiar = new EventEmitter<void>();

  // ✅ MÉTODO CORREGIDO
  onBuscar(): void {
    // Pequeño delay para asegurar que ngModel se actualice
    setTimeout(() => {
      this.buscar.emit({
        dni: this.filtroDni,
        nombre: this.filtroNombre,
      });
    }, 0);
  }

  onLimpiar(): void {
    this.filtroDni = '';
    this.filtroNombre = '';
    this.limpiar.emit();
  }
}

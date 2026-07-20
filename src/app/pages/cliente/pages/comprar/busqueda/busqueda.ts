import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-busqueda',
  imports: [CommonModule, FormsModule],
  templateUrl: './busqueda.html',
})
export class Busqueda {
  @Output() buscar = new EventEmitter<string>();

  termino: string = '';

  onBuscar(): void {
    this.buscar.emit(this.termino);
  }

  limpiar(): void {
    this.termino = '';
    this.buscar.emit('');
  }
}

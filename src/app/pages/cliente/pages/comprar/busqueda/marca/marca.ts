import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-marca',
  imports: [CommonModule, FormsModule],
  templateUrl: './marca.html',
})
export class Marca {
  @Input() marcas: string[] = [];
  @Output() cambiar = new EventEmitter<string>();

  seleccionada: string = '';

  onChange(): void {
    this.cambiar.emit(this.seleccionada);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.html',
})
export class Categoria {
  @Input() categorias: string[] = [];
  @Output() cambiar = new EventEmitter<string>();

  seleccionada: string = '';

  onChange(): void {
    this.cambiar.emit(this.seleccionada);
  }
}

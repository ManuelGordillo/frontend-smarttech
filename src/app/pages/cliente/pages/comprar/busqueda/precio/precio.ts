import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-precio',
  imports: [CommonModule, FormsModule],
  templateUrl: './precio.html',
})
export class Precio {
  @Input() precioMaximo: number = 10000;
  @Output() cambiar = new EventEmitter<number>();

  valor: number = 10000;

  ngOnChanges(): void {
    this.valor = this.precioMaximo;
  }

  onChange(): void {
    this.cambiar.emit(this.valor);
  }
}

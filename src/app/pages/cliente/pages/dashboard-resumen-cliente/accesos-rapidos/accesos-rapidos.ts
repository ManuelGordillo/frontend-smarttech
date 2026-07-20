import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'smarttech-accesos-rapidos',
  imports: [CommonModule],
  templateUrl: './accesos-rapidos.html',
})
export class AccesosRapidos {
  @Output() navegar = new EventEmitter<string>();

  irA(ruta: string): void {
    this.navegar.emit(ruta);
  }
}

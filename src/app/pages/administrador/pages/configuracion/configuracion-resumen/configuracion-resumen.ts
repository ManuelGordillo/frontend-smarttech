import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'configuracion-resumen',
  imports: [CommonModule],
  templateUrl: './configuracion-resumen.html',
})
export class ConfiguracionResumen implements OnChanges {
  @Input() datos: any = {};

  administradores: number = 0;
  vendedores: number = 0;
  clientes: number = 0;
  totalUsuarios: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      this.administradores = this.datos.administradores || 0;
      this.vendedores = this.datos.vendedores || 0;
      this.clientes = this.datos.clientes || 0;
      this.totalUsuarios = this.datos.totalUsuarios || 0;
    }
  }
}

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'configuracion-tabla',
  imports: [CommonModule],
  templateUrl: './configuracion-tabla.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionTabla implements OnChanges {
  @Input() usuarios: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarios'] && this.usuarios) {
      console.log('📋 Usuarios para tabla:', this.usuarios);
    }
  }

  getEstadoBadge(estado: boolean): string {
    return estado ? 'badge-success' : 'badge-error';
  }

  getEstadoTexto(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  getRolBadge(rol: string): string {
    const rolUpper = rol?.toUpperCase() || '';
    switch (rolUpper) {
      case 'ADMINISTRADOR':
        return 'badge-primary';
      case 'VENDEDOR':
        return 'badge-success';
      case 'CLIENTE':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  }
}

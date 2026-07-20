import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'configuracion-ranking',
  imports: [CommonModule],
  templateUrl: './configuracion-ranking.html',
})
export class ConfiguracionRanking implements OnChanges {
  @Input() ranking: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ranking'] && this.ranking) {
      console.log('🏆 Ranking recibido:', this.ranking);
    }
  }

  getMedalla(posicion: number): string {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return `${posicion}`;
  }
}

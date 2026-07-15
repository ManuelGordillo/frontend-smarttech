import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminos-condiciones.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminosCondiciones {
  constructor(private location: Location) {}
  cerrar() {
    this.location.back();
  }
}

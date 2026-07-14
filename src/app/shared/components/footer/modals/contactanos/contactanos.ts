import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contactanos',
  imports: [],
  templateUrl: './contactanos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contactanos {
  constructor(private location: Location) {}

  cerrar() {
    this.location.back();
  }
}

import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-politicas-garantia',
  imports: [],
  templateUrl: './politicas-garantia.html',
})
export class PoliticasGarantia {
  constructor(private location: Location) {}

  cerrar() {
    this.location.back();
  }
}

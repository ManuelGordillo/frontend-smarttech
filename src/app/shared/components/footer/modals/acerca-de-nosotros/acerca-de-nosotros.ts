import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-acerca-de-nosotros',
  imports: [],
  templateUrl: './acerca-de-nosotros.html',
})
export class AcercaDeNosotros {
  constructor(private location: Location) {}

  cerrar() {
    this.location.back();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { CardProducto } from '../../../shared/components/card-producto/card-producto';

@Component({
  selector: 'app-celulares',
  imports: [Navbar, Footer, CardProducto],
  templateUrl: './celulares.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Celulares {}

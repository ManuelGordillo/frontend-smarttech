import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-celulares',
  imports: [Navbar, Footer],
  templateUrl: './celulares.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Celulares {}

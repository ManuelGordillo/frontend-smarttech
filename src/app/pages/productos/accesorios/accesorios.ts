import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-accesorios',
  imports: [Footer, Navbar],
  templateUrl: './accesorios.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accesorios {}

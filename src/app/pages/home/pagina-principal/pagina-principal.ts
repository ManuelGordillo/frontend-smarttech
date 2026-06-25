import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { Testimonios } from './testimonios/testimonios';

@Component({
  selector: 'app-pagina-principal',
  imports: [Navbar, Footer, Testimonios],
  templateUrl: './pagina-principal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaPrincipal {}

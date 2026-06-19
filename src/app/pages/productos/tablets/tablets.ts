import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-tablets',
  imports: [Navbar, Footer],
  templateUrl: './tablets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tablets {}

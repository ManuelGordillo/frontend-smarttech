import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendedores',
  imports: [RouterLink],
  templateUrl: './vendedores.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Vendedores {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-productos',
  imports: [RouterLink],
  templateUrl: './productos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Productos {}

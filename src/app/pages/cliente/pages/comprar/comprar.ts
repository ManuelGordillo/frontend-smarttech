import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Busqueda } from './busqueda/busqueda';
import { Categoria } from './busqueda/categoria/categoria';
import { Marca } from './busqueda/marca/marca';
import { Precio } from './busqueda/precio/precio';

@Component({
  selector: 'app-comprar',
  imports: [Busqueda, Categoria, Marca, Precio],
  templateUrl: './comprar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Comprar {}

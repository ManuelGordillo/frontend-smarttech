import { ChangeDetectionStrategy, Component } from '@angular/core';

export interface Vendedor {
  id: number;
  nombreUsuario: string;
  contrasena: string;
  rol: string;
  estado: boolean;
}
@Component({
  selector: 'app-vendedor.model',
  imports: [],
  templateUrl: './vendedor.model.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendedorModel {}

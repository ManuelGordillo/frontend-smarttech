import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'smarttech-clientes-vendedor-header',
  imports: [RouterLink],
  templateUrl: './clientes-vendedor-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientesVendedorHeader {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClientesVendedorHeader } from './clientes-vendedor-header/clientes-vendedor-header';
import { BuscarClientesVendedor } from './buscar-clientes-vendedor/buscar-clientes-vendedor';
import { TablaClientesVendedor } from './tabla-clientes-vendedor/tabla-clientes-vendedor';
import { NuevoClientesVendedor } from './nuevo-clientes-vendedor/nuevo-clientes-vendedor';

@Component({
  selector: 'app-clientes-vendedor',
  imports: [
    ClientesVendedorHeader,
    BuscarClientesVendedor,
    TablaClientesVendedor,
    NuevoClientesVendedor,
  ],
  templateUrl: './clientes-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientesVendedor {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuHeaderCliente } from './side-menu-header-cliente/side-menu-header-cliente';
import { SideMenuOpcionesCliente } from './side-menu-opciones-cliente/side-menu-opciones-cliente';

@Component({
  selector: 'smarttech-side-menu-cliente',
  imports: [SideMenuHeaderCliente, SideMenuOpcionesCliente],
  templateUrl: './side-menu-cliente.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuCliente {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuHeaderVendedor } from './side-menu-header-vendedor/side-menu-header-vendedor';
import { SideMenuOpcionesVendedor } from './side-menu-opciones-vendedor/side-menu-opciones-vendedor';

@Component({
  selector: 'app-side-menu-vendedor',
  imports: [SideMenuHeaderVendedor, SideMenuOpcionesVendedor],
  templateUrl: './side-menu-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuVendedor {}

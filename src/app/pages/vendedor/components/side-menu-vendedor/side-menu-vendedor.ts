import { Component } from '@angular/core';
import { SideMenuHeaderVendedor } from './side-menu-header-vendedor/side-menu-header-vendedor';
import { SideMenuOpcionesVendedor } from './side-menu-opciones-vendedor/side-menu-opciones-vendedor';

@Component({
  selector: 'smarttech-side-menu-vendedor',
  imports: [SideMenuHeaderVendedor, SideMenuOpcionesVendedor],
  templateUrl: './side-menu-vendedor.html',
})
export class SideMenuVendedor {}

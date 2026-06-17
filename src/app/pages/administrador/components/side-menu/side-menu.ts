import { Component } from '@angular/core';
import { SideMenuHeader } from './side-menu-header/side-menu-header';
import { SideMenuOpciones } from './side-menu-opciones/side-menu-opciones';

@Component({
  selector: 'smarttech-side-menu',
  templateUrl: 'side-menu.html',
  imports: [SideMenuHeader, SideMenuOpciones],
})
export class SideMenu {}

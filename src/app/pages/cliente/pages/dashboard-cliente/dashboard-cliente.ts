import { Component } from '@angular/core';
import { SideMenuCliente } from '../../components/side-menu-cliente/side-menu-cliente';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-cliente',
  imports: [SideMenuCliente, RouterOutlet],
  templateUrl: './dashboard-cliente.html',
})
export default class DashboardCliente {}

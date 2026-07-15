import { Component } from '@angular/core';
import { SideMenu } from '../../components/side-menu/side-menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-administrador',
  imports: [SideMenu, RouterOutlet],
  templateUrl: './dashboard-administrador.html',
})
export default class DashboardAdministrador {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuVendedor } from '../../components/side-menu-vendedor/side-menu-vendedor';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-vendedor-dashboard',
  imports: [SideMenuVendedor, RouterOutlet],
  templateUrl: './vendedor-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendedorDashboard {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-resumen-vendedor',
  imports: [RouterLink],
  templateUrl: './dashboard-resumen-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardResumenVendedor {}

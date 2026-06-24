import { Routes } from '@angular/router';
import { VendedorDashboard } from './pages/vendedor-dashboard/vendedor-dashboard';
import { DashboardResumenVendedor } from './pages/dashboard-resumen-vendedor/dashboard-resumen-vendedor';
import { Ventas } from './pages/ventas/ventas';
import { Carrito } from './pages/carrito/carrito';
import { ClientesVendedor } from './pages/clientes-vendedor/clientes-vendedor';
import { HistorialVentas } from './pages/historial-ventas/historial-ventas';
import { Reportes } from './pages/reportes/reportes';
import { ConfiguracionVendedor } from './pages/configuracion-vendedor/configuracion-vendedor';
import { authGuard } from '../../guards/auth.guard';
import { NuevaVenta } from './pages/dashboard-resumen-vendedor/nueva-venta/nueva-venta';

export const vendedorRoutes: Routes = [
  {
    path: 'vendedor-dashboard',
    component: VendedorDashboard,
    canActivate: [() => authGuard('VENDEDOR')],

    children: [
      {
        path: 'dashboard-resumen-vendedor',
        component: DashboardResumenVendedor,
      },
      {
        path: 'ventas',
        component: Ventas,
      },
      {
        path: 'carrito',
        component: Carrito,
      },
      {
        path: 'clientes-vendedor',
        component: ClientesVendedor,
      },
      {
        path: 'historial-ventas',
        component: HistorialVentas,
      },
      {
        path: 'nueva-venta',
        component: NuevaVenta,
      },
      {
        path: 'reportes',
        component: Reportes,
      },
      {
        path: 'configuracion-vendedor',
        component: ConfiguracionVendedor,
      },
      {
        path: '**',
        redirectTo: 'dashboard-resumen-vendedor',
      },
    ],
  },
];

export default vendedorRoutes;

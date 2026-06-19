import { Routes } from '@angular/router';
import CarritoDeCompras from './pages/carrito-de-compras/carrito-de-compras';
import Comprar from './pages/comprar/comprar';
import ConfiguracionCliente from './pages/configuracion-cliente/configuracion-cliente';
import DashboardCliente from './pages/dashboard-cliente/dashboard-cliente';
import DashboardResumenCliente from './pages/dashboard-resumen-cliente/dashboard-resumen-cliente';
import HistorialDeCompras from './pages/historial-de-compras/historial-de-compras';
import Pago from './pages/pago/pago';

export const clienteRoutes: Routes = [
  {
    path: 'dashboard-cliente',
    component: DashboardCliente,

    children: [
      {
        path: 'dashboard-resumen-cliente',
        component: DashboardResumenCliente,
      },
      {
        path: 'comprar',
        component: Comprar,
      },
      {
        path: 'carrito-de-compras',
        component: CarritoDeCompras,
      },
      {
        path: 'pago',
        component: Pago,
      },
      {
        path: 'historial-de-compras',
        component: HistorialDeCompras,
      },
      {
        path: 'configuracion-cliente',
        component: ConfiguracionCliente,
      },
      {
        path: '**',
        redirectTo: 'dashboard-resumen-cliente',
      },
    ],
  },
];

export default clienteRoutes;

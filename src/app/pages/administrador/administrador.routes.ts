import { Routes } from '@angular/router';
import DashboardAdministrador from './pages/dashboard-administrador/dashboard-administrador';
import DashboardResumen from './pages/dashboard-resumen/dashboard-resumen';
import Vendedores from './pages/vendedores/vendedores';
import Clientes from './pages/clientes/clientes';
import Productos from './pages/productos/productos';
import Inventario from './pages/inventario/inventario';
import Ventas from './pages/ventas/ventas';
import Reportes from './pages/reportes/reportes';
import Configuracion from './pages/configuracion/configuracion';
import { CrearVendedor } from './pages/vendedores/crear-vendedor/crear-vendedor';
import { CrearProducto } from './pages/productos/crear-producto/crear-producto';

export const administradorRoutes: Routes = [
  {
    path: 'dashboard-administrador',
    component: DashboardAdministrador,

    children: [
      {
        path: 'dashboard-resumen',
        component: DashboardResumen,
      },
      {
        path: 'vendedores',
        component: Vendedores,
      },
      {
        path: 'crear-vendedor',
        component: CrearVendedor,
      },
      {
        path: 'clientes',
        component: Clientes,
      },
      {
        path: 'productos',
        component: Productos,
      },
      {
        path: 'crear-producto',
        component: CrearProducto,
      },
      {
        path: 'inventario',
        component: Inventario,
      },
      {
        path: 'ventas',
        component: Ventas,
      },
      {
        path: 'reportes',
        component: Reportes,
      },
      {
        path: 'configuracion',
        component: Configuracion,
      },
      {
        path: '**',
        redirectTo: 'dashboard-resumen',
      },
    ],
  },
];

export default administradorRoutes;

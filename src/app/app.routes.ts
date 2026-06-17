import { Routes } from '@angular/router';
import { Inicio } from './pages/home/inicio/inicio';
import { Navbar } from './shared/components/navbar/navbar';
import { PaginaPrincipal } from './pages/home/pagina-principal/pagina-principal';
import { Login } from './auth/login/login';
import { RegistrarCliente } from './auth/registrar-cliente/registrar-cliente';

export const routes: Routes = [
  {
    path: '',
    component: Inicio,
    title: 'Pagina de inicio',
  },
  {
    path: 'pagina-principal',
    component: PaginaPrincipal,
    title: 'Pagina-Principal',
  },
  {
    path: 'login',
    component: Login,
    title: 'Inicia sesion',
  },
  {
    path: 'registrar-cliente',
    component: RegistrarCliente,
  },
  {
    path: 'dashboard-administrador',
    // component: DashboardAdministrador,
    loadComponent: () =>
      import('./pages/administrador/pages/dashboard-administrador/dashboard-administrador'),
    children: [
      {
        path: 'dashboard-resumen',
        loadComponent: () =>
          import('./pages/administrador/pages/dashboard-resumen/dashboard-resumen'),
      },
      {
        path: 'vendedores',
        loadComponent: () => import('./pages/administrador/pages/vendedores/vendedores'),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/administrador/pages/clientes/clientes'),
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/administrador/pages/productos/productos'),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./pages/administrador/pages/inventario/inventario'),
      },
      {
        path: 'ventas',
        loadComponent: () => import('./pages/administrador/pages/ventas/ventas'),
      },
      {
        path: 'reportes',
        loadComponent: () => import('./pages/administrador/pages/reportes/reportes'),
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./pages/administrador/pages/configuracion/configuracion'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

import { Routes } from '@angular/router';
import { Inicio } from './pages/home/inicio/inicio';

import { PaginaPrincipal } from './pages/home/pagina-principal/pagina-principal';
import { Login } from './auth/login/login';
import { RegistrarCliente } from './auth/registrar-cliente/registrar-cliente';
import { Celulares } from './pages/productos/celulares/celulares';
import { RecuperarContrasena } from './auth/login/recuperar-contrasena/recuperar-contrasena';

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
    path: 'recuperar-contrasena',
    component: RecuperarContrasena,
  },
  {
    path: 'registrar-cliente',
    component: RegistrarCliente,
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.routes'),
  },
  {
    path: 'administrador',
    loadChildren: () => import('./pages/administrador/administrador.routes'),
  },
  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.routes'),
  },
  {
    path: 'vendedor',
    loadChildren: () => import('./pages/vendedor/vendedor.routes'),
  },

  {
    path: '**',
    redirectTo: '',
  },
];

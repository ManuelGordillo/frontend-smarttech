import { Routes } from '@angular/router';
import { Inicio } from './pages/home/inicio/inicio';
import { Navbar } from './shared/components/navbar/navbar';
import { PaginaPrincipal } from './pages/home/pagina-principal/pagina-principal';

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
    path: '**',
    redirectTo: '',
  },
];

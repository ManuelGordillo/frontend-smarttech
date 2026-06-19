import { Routes } from '@angular/router';
import { Celulares } from './celulares/celulares';
import { Tablets } from './tablets/tablets';
import { Accesorios } from './accesorios/accesorios';

export const productosRoutes: Routes = [
  {
    path: 'celulares',
    component: Celulares,
    title: 'celulares-disponibles',
  },
  {
    path: 'tablets',
    component: Tablets,
    title: 'tablets-disponibles',
  },
  {
    path: 'accesorios',
    component: Accesorios,
    title: 'accesorios-disponibles',
  },
];

export default productosRoutes;

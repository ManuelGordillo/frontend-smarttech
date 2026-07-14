import { Routes } from '@angular/router';
import { AcercaDeNosotros } from './modals/acerca-de-nosotros/acerca-de-nosotros';
import { ComoComprar } from './modals/como-comprar/como-comprar';
import { Contactanos } from './modals/contactanos/contactanos';
import { PoliticasGarantia } from './modals/politicas-garantia/politicas-garantia';
import { PreguntasFrecuentes } from './modals/preguntas-frecuentes/preguntas-frecuentes';
import { TerminosCondiciones } from './modals/terminos-condiciones/terminos-condiciones';

export const footerRoutes: Routes = [
  {
    path: 'acerca-de-nosotros',
    component: AcercaDeNosotros,
  },
  {
    path: 'como-comprar',
    component: ComoComprar,
  },
  {
    path: 'contactanos',
    component: Contactanos,
  },
  {
    path: 'politicas-garantia',
    component: PoliticasGarantia,
  },
  {
    path: 'preguntas-frecuentes',
    component: PreguntasFrecuentes,
  },
  {
    path: 'terminos-condiciones',
    component: TerminosCondiciones,
  },
];

export default footerRoutes;

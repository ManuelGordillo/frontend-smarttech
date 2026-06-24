import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MenuOpcionVendedor {
  titulo: string;
  subtitulo: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'smarttech-side-menu-opciones-vendedor',
  imports: [RouterLink],
  templateUrl: './side-menu-opciones-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuOpcionesVendedor {
  menuOpcionesVendedor: MenuOpcionVendedor[] = [
    {
      titulo: 'Dashboard',
      subtitulo: 'Resumen',
      ruta: '/vendedor/vendedor-dashboard/dashboard-resumen-vendedor',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Comprar',
      subtitulo: 'Catalogo',
      ruta: '/cliente/dashboard-cliente/comprar',
      icono: 'fa-solid fa-bag-shopping',
    },
    {
      titulo: 'Carrito de compras',
      subtitulo: 'Productos Agregados',
      ruta: '/cliente/dashboard-cliente/carrito-de-compras',
      icono: 'fa-solid fa-cart-shopping',
    },
    {
      titulo: 'Pago',
      subtitulo: 'Metodo de Pago',
      ruta: '/cliente/dashboard-cliente/pago',
      icono: 'fa-solid fa-coins',
    },
    {
      titulo: 'Historial de Compras',
      subtitulo: 'Lista de pedidos',
      ruta: '/cliente/dashboard-cliente/historial-de-compras',
      icono: 'fa-solid fa-clock-rotate-left',
    },
    {
      titulo: 'Configuracion',
      subtitulo: 'Editar Perfil',
      ruta: '/cliente/dashboard-cliente/configuracion-cliente',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Cerrar sesión',
      subtitulo: 'Salir',
      ruta: '/cliente/dashboard-cliente/cerrar-sesion-cliente',
      icono: 'fa-solid fa-screwdriver-wrench',
    },
  ];
}

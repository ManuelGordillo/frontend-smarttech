import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
  private router = inject(Router);
  menuOpcionesVendedor: MenuOpcionVendedor[] = [
    {
      titulo: 'Dashboard',
      subtitulo: 'Resumen',
      ruta: '/vendedor/vendedor-dashboard/dashboard-resumen-vendedor',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Carrito',
      subtitulo: 'Productos',
      ruta: '/vendedor/vendedor-dashboard/carrito',
      icono: 'fa-solid fa-bag-shopping',
    },
    {
      titulo: 'Clientes',
      subtitulo: 'Clientes del vendedor',
      ruta: '/vendedor/vendedor-dashboard/clientes-vendedor',
      icono: 'fa-solid fa-cart-shopping',
    },
    {
      titulo: 'Historial de Ventas',
      subtitulo: 'Resumen ventas',
      ruta: '/vendedor/vendedor-dashboard/historial-ventas',
      icono: 'fa-solid fa-coins',
    },
    {
      titulo: 'Ventas',
      subtitulo: 'Lista de Ventas',
      ruta: '/vendedor/vendedor-dashboard/ventas',
      icono: 'fa-solid fa-clock-rotate-left',
    },
    {
      titulo: 'Configuracion',
      subtitulo: 'Editar Perfil',
      ruta: '/vendedor/vendedor-dashboard/configuracion-vendedor',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Cerrar Sesión',
      subtitulo: 'Salir',
      ruta: '/vendedor/vendedor-dashboard/cerrar-sesion',
      icono: 'fa-solid fa-screwdriver-wrench',
    },
  ];
  cerrarSesionVendedor(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/pagina-principal']);
  }
}

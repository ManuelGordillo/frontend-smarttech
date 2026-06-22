import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

interface MenuOpcion {
  titulo: string;
  subtitulo: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'smarttech-side-menu-opciones',
  imports: [RouterLink],
  templateUrl: './side-menu-opciones.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuOpciones {
  private router = inject(Router);
  menuOpciones: MenuOpcion[] = [
    {
      titulo: 'Dashboard',
      subtitulo: 'Resumen',
      ruta: '/administrador/dashboard-administrador/dashboard-resumen',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Vendedores',
      subtitulo: 'Lista de Vendedores',
      ruta: '/administrador/dashboard-administrador/vendedores',
      icono: 'fa-solid fa-tags',
    },
    {
      titulo: 'Clientes',
      subtitulo: 'Lista de Clientes',
      ruta: '/administrador/dashboard-administrador/clientes',
      icono: 'fa-solid fa-user-group',
    },
    {
      titulo: 'Productos',
      subtitulo: 'Lista de Productos',
      ruta: '/administrador/dashboard-administrador/productos',
      icono: 'fa-solid fa-box',
    },
    {
      titulo: 'Inventario',
      subtitulo: 'Stock',
      ruta: '/administrador/dashboard-administrador/inventario',
      icono: 'fa-solid fa-database',
    },
    {
      titulo: 'Ventas',
      subtitulo: 'Resumen de Ventas',
      ruta: '/administrador/dashboard-administrador/ventas',
      icono: 'fa-solid fa-bag-shopping',
    },
    {
      titulo: 'Reportes',
      subtitulo: 'Estadisticas',
      ruta: '/administrador/dashboard-administrador/reportes',
      icono: 'fa-solid fa-chart-column',
    },
    {
      titulo: 'Configuración',
      subtitulo: 'Historial de usuarios',
      ruta: '/administrador/dashboard-administrador/configuracion',
      icono: 'fa-solid fa-screwdriver-wrench',
    },
    {
      titulo: 'Cerrar Sesión',
      subtitulo: 'Salir del dashboard',
      ruta: '/administrador/dashboard-administrador/cerrar-sesion',
      icono: 'fa-solid fa-arrow-right-from-bracket',
    },
  ];
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/pagina-principal']);
  }
}

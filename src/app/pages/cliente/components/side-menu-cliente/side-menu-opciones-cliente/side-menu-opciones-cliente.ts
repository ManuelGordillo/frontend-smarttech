import { ChangeDetectionStrategy, Component } from '@angular/core';

interface MenuOpcionCliente {
  titulo: string;
  subtitulo: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'smarttech-side-menu-opciones-cliente',
  imports: [],
  templateUrl: './side-menu-opciones-cliente.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuOpcionesCliente {
  menuOpcionesCliente: MenuOpcionCliente[] = [
    {
      titulo: 'Dashboard',
      subtitulo: 'Resumen',
      ruta: '/',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Comprar',
      subtitulo: 'Catalogo',
      ruta: '',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Carrito de compras',
      subtitulo: 'Productos Agregados',
      ruta: '',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Pago',
      subtitulo: 'Metodo de Pago',
      ruta: '',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Historial de Compras',
      subtitulo: 'Lista de pedidos',
      ruta: '',
      icono: 'fa-solid fa-chart-line',
    },
    {
      titulo: 'Configuracion',
      subtitulo: 'Editar Perfil',
      ruta: '',
      icono: 'fa-solid fa-chart-line',
    },
  ];
}

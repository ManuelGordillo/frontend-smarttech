import { Component, input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoInterface } from '../../../../../interfaces/producto.interface';

@Component({
  selector: 'smarttech-ventas-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-productos.html',
})
export class VentasProductos {
  // Input para recibir productos del padre
  productos = input<ProductoInterface[]>([]);

  // Output para emitir evento al agregar al carrito
  agregarAlCarrito = output<ProductoInterface>();
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoInterface } from '../../../../../interfaces/producto.interface';

@Component({
  selector: 'inventario-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario-tabla.html',
})
export class InventarioTabla {
  @Input() productos: ProductoInterface[] = [];

  // ✅ Clase para el estado del producto
  getEstadoClass(producto: ProductoInterface): string {
    if (producto.stock === 0) return 'bg-red-100 text-red-700';
    if (producto.stock < 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }

  // ✅ Clase para el stock (color según cantidad)
  getStockClass(stock: number): string {
    if (stock === 0) return 'bg-red-100 text-red-700';
    if (stock < 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }

  // ✅ Texto del estado
  getEstadoTexto(producto: ProductoInterface): string {
    if (producto.stock === 0) return 'Agotado';
    if (producto.stock < 5) return 'Stock Bajo';
    return 'Disponible';
  }
}

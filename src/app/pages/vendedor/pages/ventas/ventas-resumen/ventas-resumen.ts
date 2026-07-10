import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoInterface } from '../../../../../interfaces/producto.interface';
import { CarritoProducto } from '../../../../../interfaces/carrito.interface';

@Component({
  selector: 'smarttech-ventas-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-resumen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentasResumen {
  // Inputs
  productos = input<ProductoInterface[]>([]);
  carrito = input<CarritoProducto[]>([]); // ← Ahora recibe un array

  // Computed para contar productos disponibles
  totalProductos = computed(() => {
    return this.productos().filter((p) => p.estado !== false).length;
  });

  // Computed para contar marcas únicas
  totalMarcas = computed(() => {
    const marcas = new Set(
      this.productos()
        .map((p) => p.marca)
        .filter(Boolean),
    );
    return marcas.size;
  });

  // Computed para contar items en el carrito
  totalCarrito = computed(() => {
    return this.carrito().reduce((total, item) => total + item.cantidad, 0);
  });
}

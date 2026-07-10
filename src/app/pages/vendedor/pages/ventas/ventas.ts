import { Component, signal, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VentasFiltros } from './ventas-filtros/ventas-filtros';
import { VentasResumen } from './ventas-resumen/ventas-resumen';
import { CardProducto } from '../../../../shared/components/card-producto/card-producto';
import { ProductoService } from '../../../../services/producto.service';
import { ProductoInterface } from '../../../../interfaces/producto.interface';
import { CarritoService } from '../../../../services/carrito.service';
import { CarritoInterface } from '../../../../interfaces/carrito.interface';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterLink, VentasFiltros, VentasResumen, CardProducto],
  templateUrl: './ventas.html',
})
export class Ventas implements OnInit {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private cdr = inject(ChangeDetectorRef);

  // Signal para productos filtrados
  productosFiltrados = signal<ProductoInterface[]>([]);

  // Signal para el carrito
  carrito = signal<CarritoInterface>({
    cliente: null,
    productos: [],
    subtotal: 0,
    igv: 0,
    total: 0,
  });

  // ✅ Signal para el contador del carrito
  totalProductosCarrito = signal<number>(0);

  ngOnInit(): void {
    this.cargarProductos();

    // Suscribirse a cambios del carrito
    this.carritoService.carrito$.subscribe((carrito) => {
      console.log('🛒 Carrito recibido:', carrito.productos.length);
      this.carrito.set(carrito);
      this.totalProductosCarrito.set(carrito.productos.length);

      // ✅ Forzar detección de cambios
      this.cdr.detectChanges();
    });

    // ✅ Obtener el estado inicial del carrito
    const carritoInicial = this.carritoService.getCarritoSnapshot();
    this.totalProductosCarrito.set(carritoInicial.productos.length);
  }

  private cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productosFiltrados.set(productos);
        console.log('✅ Productos cargados en ventas:', productos.length);
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      },
    });
  }

  onProductosFiltrados(productosFiltrados: ProductoInterface[]): void {
    this.productosFiltrados.set(productosFiltrados);
  }

  agregarAlCarrito(producto: ProductoInterface): void {
    if (producto.stock <= 0) {
      alert('⚠️ Producto sin stock');
      return;
    }

    if (producto.estado === false) {
      alert('⚠️ Producto no disponible');
      return;
    }

    this.carritoService.agregarProducto(producto);
    console.log('✅ Producto agregado al carrito:', producto.modelo);

    // ✅ Actualizar contador manualmente (por si acaso)
    setTimeout(() => {
      const carritoActual = this.carritoService.getCarritoSnapshot();
      this.totalProductosCarrito.set(carritoActual.productos.length);
      this.cdr.detectChanges();
    }, 50);
  }
}

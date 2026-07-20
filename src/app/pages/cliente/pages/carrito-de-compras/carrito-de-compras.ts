import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../../../services/carrito.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrito-de-compras',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito-de-compras.html',
})
export default class CarritoDeCompras implements OnInit, OnDestroy {
  private carritoService = inject(CarritoService);
  private router = inject(Router);

  private carritoSubscription!: Subscription;

  productos: any[] = [];
  subtotal: number = 0;
  igv: number = 0;
  total: number = 0;
  totalProductos: number = 0;

  ngOnInit(): void {
    this.carritoSubscription = this.carritoService.carrito$.subscribe({
      next: (carrito) => {
        this.productos = carrito.productos || [];
        this.subtotal = carrito.subtotal || 0;
        this.igv = carrito.igv || 0;
        this.total = carrito.total || 0;
        this.totalProductos = this.productos.reduce((sum, p) => sum + p.cantidad, 0);
        console.log('🛒 Carrito actualizado:', this.totalProductos, 'productos');
      },
      error: (error) => {
        console.error('❌ Error al obtener carrito:', error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  aumentarCantidad(id: number): void {
    const producto = this.productos.find((p) => p.id === id);
    if (producto && producto.cantidad < producto.stock) {
      this.carritoService.actualizarCantidad(id, producto.cantidad + 1);
    } else {
      alert('No hay suficiente stock disponible');
    }
  }

  disminuirCantidad(id: number): void {
    const producto = this.productos.find((p) => p.id === id);
    if (producto && producto.cantidad > 1) {
      this.carritoService.actualizarCantidad(id, producto.cantidad - 1);
    } else {
      this.eliminarProducto(id);
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Eliminar este producto del carrito?')) {
      this.carritoService.eliminarProducto(id);
    }
  }

  vaciarCarrito(): void {
    if (confirm('¿Vaciar todo el carrito?')) {
      this.carritoService.limpiarCarrito();
    }
  }

  irAlPago(): void {
    if (this.productos.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    this.router.navigate(['/cliente/dashboard-cliente/pago']);
  }
}

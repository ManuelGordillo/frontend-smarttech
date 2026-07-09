// carrito.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../../services/carrito.service';
import { CarritoInterface } from '../../../../interfaces/carrito.interface';

@Component({
  selector: 'smarttech-carrito',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrito.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrito implements OnInit {
  carrito: CarritoInterface = {
    cliente: null,
    productos: [],
    subtotal: 0,
    igv: 0,
    total: 0,
  };

  tipoComprobante: string = 'BOLETA';

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    // ✅ Suscribirse al carrito para recibir actualizaciones
    this.carritoService.carrito$.subscribe((carrito) => {
      this.carrito = carrito;
      console.log('🛒 Carrito actualizado:', carrito);

      if (carrito.cliente) {
        console.log('👤 Cliente en carrito:', carrito.cliente.nombre, carrito.cliente.apellido);
      }
    });
  }

  // ==========================================
  // AUMENTAR CANTIDAD
  // ==========================================
  aumentarCantidad(id: number): void {
    const producto = this.carrito.productos.find((p) => p.id === id);
    if (producto) {
      this.carritoService.actualizarCantidad(id, producto.cantidad + 1);
    }
  }

  // ==========================================
  // DISMINUIR CANTIDAD
  // ==========================================
  disminuirCantidad(id: number): void {
    const producto = this.carrito.productos.find((p) => p.id === id);
    if (producto && producto.cantidad > 1) {
      this.carritoService.actualizarCantidad(id, producto.cantidad - 1);
    } else if (producto && producto.cantidad === 1) {
      this.carritoService.eliminarProducto(id);
    }
  }

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================
  eliminarProducto(id: number): void {
    this.carritoService.eliminarProducto(id);
  }

  // ==========================================
  // FINALIZAR VENTA
  // ==========================================
  finalizarVenta(): void {
    if (!this.carrito.cliente) {
      alert('⚠️ Por favor, selecciona un cliente primero');
      return;
    }

    if (this.carrito.productos.length === 0) {
      alert('⚠️ No hay productos en el carrito');
      return;
    }

    console.log('✅ Finalizando venta:', {
      cliente: this.carrito.cliente,
      productos: this.carrito.productos,
      total: this.carrito.total,
      tipoComprobante: this.tipoComprobante,
    });

    alert(`✅ Venta finalizada por S/ ${this.carrito.total.toFixed(2)}`);
  }

  // ==========================================
  // VACIAR CARRITO
  // ==========================================
  vaciarCarrito(): void {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.carritoService.vaciarProductos();
    }
  }
}

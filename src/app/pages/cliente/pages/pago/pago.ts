import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../../../services/carrito.service';
import { VentasService } from '../../../../services/ventas.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pago',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pago.html',
})
export default class Pago implements OnInit {
  private carritoService = inject(CarritoService);
  private ventasService = inject(VentasService);
  private router = inject(Router);

  productos: any[] = [];
  subtotal: number = 0;
  igv: number = 0;
  total: number = 0;

  clienteId: number = 0;
  usuarioId: number = 0;

  // ✅ NUEVO: Tipo de entrega
  tipoEntrega: string = 'ENVIO'; // 'ENVIO' | 'RECOJO'

  direccion = {
    nombreCompleto: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    distrito: '',
  };

  metodoPago: string = 'TARJETA';

  tarjeta = {
    numero: '',
    fecha: '',
    cvv: '',
    nombre: '',
  };

  procesando: boolean = false;

  ngOnInit(): void {
    this.cargarCarrito();
    this.cargarDatosCliente();
  }

  cargarCarrito(): void {
    const carrito = this.carritoService.getCarritoSnapshot();
    this.productos = carrito.productos || [];
    this.subtotal = carrito.subtotal || 0;
    this.igv = carrito.igv || 0;
    this.total = carrito.total || 0;

    console.log('🛒 Carrito en pago:', this.productos.length, 'productos');
  }

  cargarDatosCliente(): void {
    const clienteId =
      localStorage.getItem('clienteId') ||
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('id') ||
      '0';
    this.clienteId = Number(clienteId);
    this.usuarioId = Number(clienteId);

    const nombre =
      localStorage.getItem('nombreVendedor') ||
      localStorage.getItem('nombre') ||
      localStorage.getItem('nombreUsuario') ||
      '';
    if (nombre) {
      this.direccion.nombreCompleto = nombre;
    }
  }

  // ✅ Cambiar tipo de entrega
  cambiarTipoEntrega(): void {
    console.log('📦 Tipo de entrega:', this.tipoEntrega);
  }

  confirmarCompra(): void {
    if (this.productos.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // ✅ Validar dirección solo si es envío
    if (this.tipoEntrega === 'ENVIO') {
      if (!this.direccion.direccion || !this.direccion.ciudad) {
        alert('Por favor completa la dirección de envío');
        return;
      }
    }

    this.procesando = true;

    // ✅ Construir la venta con el tipo de entrega
    const venta = {
      cliente: { id: this.clienteId },
      usuario: { id: this.usuarioId },
      total: this.total,
      tipoPago: this.metodoPago,
      estado: 'PENDIENTE',
      tipoEntrega: this.tipoEntrega, // ✅ Nuevo campo
      direccion: this.tipoEntrega === 'ENVIO' ? this.direccion : null,
      detalles: this.productos.map((p: any) => ({
        producto: { id: p.id },
        cantidad: p.cantidad,
        precio_unitario: p.precio,
        subtotal: p.subtotal,
      })),
    };

    console.log('📦 Enviando venta:', JSON.stringify(venta, null, 2));

    this.ventasService.crearVenta(venta).subscribe({
      next: (response) => {
        console.log('✅ Venta creada:', response);
        this.procesando = false;
        alert('🎉 ¡Compra realizada con éxito!');

        this.carritoService.limpiarCarrito();
        this.router.navigate(['/cliente/dashboard-cliente/historial-de-compras']);
      },
      error: (error) => {
        console.error('❌ Error al crear venta:', error);
        this.procesando = false;

        let mensaje = 'Error al procesar la compra. ';
        if (error.error?.message) {
          mensaje += error.error.message;
        } else if (error.error) {
          mensaje += error.error;
        }
        alert(mensaje);
      },
    });
  }

  volverAlCarrito(): void {
    this.router.navigate(['/cliente/dashboard-cliente/carrito-de-compras']);
  }
}

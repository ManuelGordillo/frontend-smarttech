import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../../services/carrito.service';
import { CarritoInterface } from '../../../../interfaces/carrito.interface';
import { PdfService } from '../../../../services/pdf.service';

@Component({
  selector: 'smarttech-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrito.html',
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

  // Para el modal de factura
  mostrarModalFactura: boolean = false;
  datosFactura = {
    ruc: '',
    razonSocial: '',
    direccion: '',
  };

  constructor(
    private carritoService: CarritoService,
    private pdfService: PdfService,
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe((carrito) => {
      this.carrito = carrito;
      console.log('🛒 Carrito actualizado:', carrito);
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
  // ✅ FINALIZAR VENTA - SOLO GENERA PDF
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

    // Si es FACTURA, mostrar modal
    if (this.tipoComprobante === 'FACTURA') {
      this.mostrarModalFactura = true;
      return;
    }

    // Si es BOLETA, generar PDF directamente
    this.generarPDF();
  }

  // ==========================================
  // ✅ GENERAR PDF (SIN GUARDAR EN BD)
  // ==========================================
  generarPDF(datosFactura?: any): void {
    try {
      if (this.tipoComprobante === 'BOLETA') {
        this.pdfService.generarBoleta(this.carrito);
      } else {
        this.pdfService.generarFactura(this.carrito, datosFactura);
      }

      // Cerrar modal
      this.mostrarModalFactura = false;
      this.datosFactura = { ruc: '', razonSocial: '', direccion: '' };

      alert('✅ Comprobante generado exitosamente');

      // Limpiar carrito
      this.carritoService.vaciarProductos();
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      alert('❌ Error al generar el comprobante');
    }
  }

  // ==========================================
  // ✅ CERRAR MODAL FACTURA
  // ==========================================
  cerrarModalFactura(): void {
    this.mostrarModalFactura = false;
    this.datosFactura = { ruc: '', razonSocial: '', direccion: '' };
  }

  // ==========================================
  // ✅ CONFIRMAR FACTURA
  // ==========================================
  confirmarFactura(): void {
    if (!this.datosFactura.ruc || this.datosFactura.ruc.length < 11) {
      alert('⚠️ Ingrese un RUC válido (11 dígitos)');
      return;
    }

    if (!this.datosFactura.razonSocial) {
      alert('⚠️ Ingrese la Razón Social');
      return;
    }

    this.generarPDF(this.datosFactura);
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

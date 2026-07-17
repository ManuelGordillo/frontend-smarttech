import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoInterface } from '../../../interfaces/producto.interface';
import { CarritoService } from '../../../services/carrito.service'; // ✅ Importar

@Component({
  selector: 'smarttech-card-producto',
  imports: [CommonModule],
  templateUrl: './card-producto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProducto {
  @Input() producto!: ProductoInterface;
  @Output() verDetalle = new EventEmitter<ProductoInterface>();
  // @Output() agregarCarrito = new EventEmitter<ProductoInterface>(); // ❌ Ya no lo necesitas

  constructor(private carritoService: CarritoService) {} // ✅ Inyectar servicio

  // ==========================================
  // GETTERS (sin cambios)
  // ==========================================
  getImagenUrl(): string | null {
    if (this.producto.imagen) {
      return this.producto.imagen;
    }
    if (this.producto.imagenes && this.producto.imagenes.length > 0) {
      const principal = this.producto.imagenes.find((img) => img.esPrincipal);
      return principal ? principal.url : this.producto.imagenes[0].url;
    }
    return null;
  }

  get tieneImagen(): boolean {
    if (this.producto.imagen) return true;
    if (this.producto.imagenes && this.producto.imagenes.length > 0) return true;
    return false;
  }

  getPrecioFormateado(): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(this.producto.precio);
  }

  get tieneStock(): boolean {
    return this.producto.stock > 0 && this.producto.estado !== false;
  }

  get estadoActivo(): boolean {
    return this.producto.estado !== false;
  }

  get stockText(): string {
    if (this.producto.stock === 0) return 'Agotado';
    if (this.producto.stock < 5) return `¡Últimas ${this.producto.stock}!`;
    return `${this.producto.stock} disponibles`;
  }

  get stockClass(): string {
    if (this.producto.stock === 0) return 'text-red-600';
    if (this.producto.stock < 5) return 'text-orange-500';
    return 'text-green-600';
  }

  get categoriaIcono(): string {
    const iconos: { [key: string]: string } = {
      CELULAR: '📱',
      TABLET: '📟',
      AUDIFONO: '🎧',
      ACCESORIO: '🔌',
    };
    return iconos[this.producto.categoria] || '📦';
  }

  get categoriaColor(): string {
    const colores: { [key: string]: string } = {
      CELULAR: 'bg-blue-500',
      TABLET: 'bg-purple-500',
      AUDIFONO: 'bg-green-500',
      ACCESORIO: 'bg-orange-500',
    };
    return colores[this.producto.categoria] || 'bg-gray-500';
  }

  // ==========================================
  // MÉTODOS
  // ==========================================
  handleImageError(event: any) {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    const placeholder = parent?.querySelector('.no-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  // ==========================================
  // EVENTOS
  // ==========================================
  onVerDetalle() {
    this.verDetalle.emit(this.producto);
  }

  // ✅ MODIFICADO: Usa el servicio directamente
  onAgregarCarrito() {
    if (!this.tieneStock) {
      console.warn('⚠️ Producto sin stock:', this.producto.modelo);
      return;
    }

    // ✅ Agregar al carrito usando el servicio
    this.carritoService.agregarProducto(this.producto);

    // Feedback opcional
    console.log('🛒 Agregado al carrito:', this.producto.modelo);
  }
}

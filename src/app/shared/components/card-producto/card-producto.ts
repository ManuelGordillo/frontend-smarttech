// card-producto.component.ts
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoInterface } from '../../../interfaces/producto.interface';

@Component({
  selector: 'smarttech-card-producto',
  imports: [CommonModule],
  templateUrl: './card-producto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProducto {
  @Input() producto!: ProductoInterface;
  @Output() verDetalle = new EventEmitter<ProductoInterface>();
  @Output() agregarCarrito = new EventEmitter<ProductoInterface>();

  // ✅ MODIFICADO: Si no hay imagen, retorna null o vacío
  getImagenUrl(): string | null {
    // Si el producto tiene imagen directa
    if (this.producto.imagen) {
      return this.producto.imagen;
    }
    // Si tiene múltiples imágenes (del backend)
    if (this.producto.imagenes && this.producto.imagenes.length > 0) {
      const principal = this.producto.imagenes.find((img) => img.esPrincipal);
      return principal ? principal.url : this.producto.imagenes[0].url;
    }
    // ✅ No retorna ninguna imagen por defecto
    return null;
  }

  // ✅ NUEVO: Verificar si tiene imagen
  get tieneImagen(): boolean {
    if (this.producto.imagen) {
      return true;
    }
    if (this.producto.imagenes && this.producto.imagenes.length > 0) {
      return true;
    }
    return false;
  }

  // Formatear precio en soles
  getPrecioFormateado(): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(this.producto.precio);
  }

  // Verificar si tiene stock
  get tieneStock(): boolean {
    return this.producto.stock > 0 && this.producto.estado !== false;
  }

  // Obtener el estado del producto
  get estadoActivo(): boolean {
    return this.producto.estado !== false;
  }

  // Obtener texto de stock
  get stockText(): string {
    if (this.producto.stock === 0) return 'Agotado';
    if (this.producto.stock < 5) return `¡Últimas ${this.producto.stock}!`;
    return `${this.producto.stock} disponibles`;
  }

  // Obtener clase de stock para estilos
  get stockClass(): string {
    if (this.producto.stock === 0) return 'text-red-600';
    if (this.producto.stock < 5) return 'text-orange-500';
    return 'text-green-600';
  }

  // Obtener icono de categoría
  get categoriaIcono(): string {
    const iconos: { [key: string]: string } = {
      CELULAR: '📱',
      TABLET: '📟',
      AUDIFONO: '🎧',
      ACCESORIO: '🔌',
    };
    return iconos[this.producto.categoria] || '📦';
  }

  // Obtener color de categoría
  get categoriaColor(): string {
    const colores: { [key: string]: string } = {
      CELULAR: 'bg-blue-500',
      TABLET: 'bg-purple-500',
      AUDIFONO: 'bg-green-500',
      ACCESORIO: 'bg-orange-500',
    };
    return colores[this.producto.categoria] || 'bg-gray-500';
  }

  // ✅ MODIFICADO: No hace nada si no hay imagen
  handleImageError(event: any) {
    // Oculta la imagen si falla
    event.target.style.display = 'none';
    // Muestra el placeholder de texto
    const parent = event.target.parentElement;
    const placeholder = parent.querySelector('.no-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  // Emitir evento para ver detalle
  onVerDetalle() {
    this.verDetalle.emit(this.producto);
  }

  // Emitir evento para agregar al carrito
  onAgregarCarrito() {
    if (this.tieneStock) {
      this.agregarCarrito.emit(this.producto);
    }
  }
}

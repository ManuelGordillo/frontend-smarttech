import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../../services/producto.service';
import { ProductoInterface } from '../../../../interfaces/producto.interface';

@Component({
  selector: 'app-ProductoInterfaces',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './productos.html',
})
export default class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);

  productos: ProductoInterface[] = [];
  loading: boolean = false;
  error: string = '';
  mensajeExito: string = '';

  // 🔥 FILTROS
  filtroBusqueda: string = '';
  filtroMarca: string = '';
  filtroCategoria: string = '';
  filtroColor: string = '';

  // 🔥 LISTA DE OPCIONES PARA FILTROS
  marcas: string[] = [];
  categorias: string[] = [];
  colores: string[] = [];

  // 🔥 PRODUCTOS FILTRADOS (GETTER normal)
  get productosFiltrados(): ProductoInterface[] {
    return this.productos.filter((producto) => {
      const coincideBusqueda =
        producto.modelo.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        producto.marca.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      const coincideMarca = this.filtroMarca ? producto.marca === this.filtroMarca : true;
      const coincideCategoria = this.filtroCategoria
        ? producto.categoria === this.filtroCategoria
        : true;
      const coincideColor = this.filtroColor ? producto.color === this.filtroColor : true;

      return coincideBusqueda && coincideMarca && coincideCategoria && coincideColor;
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = '⚠️ No has iniciado sesión.';
      return;
    }
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = '';

    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargarOpcionesFiltros();
        this.loading = false;
        console.log('✅ Productos cargados:', data);
      },
      error: (error: any) => {
        console.error('❌ Error:', error);
        this.error = 'Error al cargar los productos';
        this.loading = false;
      },
    });
  }

  // 🔥 CARGAR OPCIONES PARA FILTROS
  cargarOpcionesFiltros(): void {
    const marcasSet = new Set(this.productos.map((p) => p.marca));
    const categoriasSet = new Set(this.productos.map((p) => p.categoria));
    const coloresSet = new Set(this.productos.map((p) => p.color));

    this.marcas = Array.from(marcasSet);
    this.categorias = Array.from(categoriasSet);
    this.colores = Array.from(coloresSet);
  }

  // 🔥 LIMPIAR FILTROS
  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroMarca = '';
    this.filtroCategoria = '';
    this.filtroColor = '';
  }

  // 🔥 ELIMINAR PRODUCTO
  eliminarProducto(id: number | undefined): void {
    if (!id) {
      console.error('❌ ID no válido');
      this.error = 'Error: ID de producto no válido';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter((p) => p.id !== id);
        this.cargarOpcionesFiltros();
        this.mensajeExito = '✅ Producto eliminado correctamente';
        setTimeout(() => (this.mensajeExito = ''), 3000);
      },
      error: (error: any) => {
        console.error('❌ Error:', error);
        this.error = 'Error al eliminar el producto';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }

  // 🔥 ACTUALIZAR ESTADO (conversión boolean <-> string)
  cambiarEstado(producto: ProductoInterface): void {
    // ✅ VERIFICAR QUE EL ID EXISTA
    if (!producto.id) {
      console.error('❌ El producto no tiene ID');
      this.error = 'Error: ID de producto no válido';
      setTimeout(() => (this.error = ''), 3000);
      return;
    }

    const nuevoEstadoBoolean = !producto.estado;
    const nuevoEstadoString = nuevoEstadoBoolean ? 'Disponible' : 'Agotado';

    if (!confirm(`¿Cambiar estado a "${nuevoEstadoString}"?`)) {
      return;
    }

    this.productoService.cambiarEstadoProducto(producto.id, nuevoEstadoString).subscribe({
      next: () => {
        producto.estado = nuevoEstadoBoolean;
        this.mensajeExito = `✅ Estado actualizado a "${nuevoEstadoString}"`;
        setTimeout(() => (this.mensajeExito = ''), 3000);
      },
      error: (error: any) => {
        console.error('❌ Error:', error);
        this.error = 'Error al cambiar el estado';
        setTimeout(() => (this.error = ''), 3000);
      },
    });
  }
}

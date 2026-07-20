import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Busqueda } from './busqueda/busqueda';
import { Categoria } from './busqueda/categoria/categoria';
import { Marca } from './busqueda/marca/marca';
import { Precio } from './busqueda/precio/precio';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-comprar',
  imports: [CommonModule, Busqueda, Categoria, Marca, Precio],
  templateUrl: './comprar.html',
})
export default class Comprar implements OnInit {
  private productoService = inject(ProductoService);

  // Lista de productos
  productos: any[] = [];
  productosFiltrados: any[] = [];

  // Filtros
  filtros = {
    busqueda: '',
    categoria: '',
    marca: '',
    precioMaximo: 10000,
  };

  // Datos para filtros
  categorias: string[] = [];
  marcas: string[] = [];

  // Producto seleccionado para el modal
  productoSeleccionado: any = null;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data: any[]) => {
        console.log('📦 Productos cargados:', data.length);
        this.productos = data;
        this.productosFiltrados = data;

        // Extraer categorías y marcas únicas
        this.categorias = [...new Set(data.map((p: any) => p.categoria).filter(Boolean))];
        this.marcas = [...new Set(data.map((p: any) => p.marca).filter(Boolean))];

        console.log('📂 Categorías:', this.categorias);
        console.log('🏷️ Marcas:', this.marcas);
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
      },
    });
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter((p: any) => {
      // Filtro por búsqueda
      const busqueda = this.filtros.busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !busqueda ||
        p.modelo?.toLowerCase().includes(busqueda) ||
        p.marca?.toLowerCase().includes(busqueda) ||
        p.descripcion?.toLowerCase().includes(busqueda);

      // Filtro por categoría
      const coincideCategoria = !this.filtros.categoria || p.categoria === this.filtros.categoria;

      // Filtro por marca
      const coincideMarca = !this.filtros.marca || p.marca === this.filtros.marca;

      // Filtro por precio máximo
      const coincidePrecio = (p.precio || 0) <= this.filtros.precioMaximo;

      return coincideBusqueda && coincideCategoria && coincideMarca && coincidePrecio;
    });

    console.log('📊 Productos filtrados:', this.productosFiltrados.length);
  }

  // Métodos para actualizar filtros desde los hijos
  actualizarBusqueda(termino: string): void {
    this.filtros.busqueda = termino;
    this.aplicarFiltros();
  }

  actualizarCategoria(categoria: string): void {
    this.filtros.categoria = categoria;
    this.aplicarFiltros();
  }

  actualizarMarca(marca: string): void {
    this.filtros.marca = marca;
    this.aplicarFiltros();
  }

  actualizarPrecio(precio: number): void {
    this.filtros.precioMaximo = precio;
    this.aplicarFiltros();
  }

  // Ver detalle del producto
  verDetalle(producto: any): void {
    this.productoSeleccionado = producto;
    console.log('🔍 Ver detalle:', producto);
  }

  // Cerrar modal
  cerrarModal(): void {
    this.productoSeleccionado = null;
  }

  // Agregar al carrito
  agregarAlCarrito(producto: any): void {
    console.log('🛒 Agregar al carrito:', producto);
    // Aquí la lógica para agregar al carrito
    // Puedes emitir un evento o usar un servicio de carrito
    alert(`Producto agregado al carrito: ${producto.marca} ${producto.modelo}`);
  }
}

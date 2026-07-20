import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Busqueda } from './busqueda/busqueda';
import { Categoria } from './busqueda/categoria/categoria';
import { Marca } from './busqueda/marca/marca';
import { Precio } from './busqueda/precio/precio';
import { ProductoService } from '../../../../services/producto.service';
import { CarritoService } from '../../../../services/carrito.service'; // ← AGREGADO

@Component({
  selector: 'app-comprar',
  imports: [CommonModule, Busqueda, Categoria, Marca, Precio],
  templateUrl: './comprar.html',
})
export default class Comprar implements OnInit {
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService); // ← AGREGADO

  productos: any[] = [];
  productosFiltrados: any[] = [];

  filtros = {
    busqueda: '',
    categoria: '',
    marca: '',
    precioMaximo: 10000,
  };

  categorias: string[] = [];
  marcas: string[] = [];
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
      const busqueda = this.filtros.busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !busqueda ||
        p.modelo?.toLowerCase().includes(busqueda) ||
        p.marca?.toLowerCase().includes(busqueda) ||
        p.descripcion?.toLowerCase().includes(busqueda);

      const coincideCategoria = !this.filtros.categoria || p.categoria === this.filtros.categoria;
      const coincideMarca = !this.filtros.marca || p.marca === this.filtros.marca;
      const coincidePrecio = (p.precio || 0) <= this.filtros.precioMaximo;

      return coincideBusqueda && coincideCategoria && coincideMarca && coincidePrecio;
    });

    console.log('📊 Productos filtrados:', this.productosFiltrados.length);
  }

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

  verDetalle(producto: any): void {
    this.productoSeleccionado = producto;
    console.log('🔍 Ver detalle:', producto);
  }

  cerrarModal(): void {
    this.productoSeleccionado = null;
  }

  // ✅ MÉTODO ACTUALIZADO
  agregarAlCarrito(producto: any): void {
    this.carritoService.agregarProducto(producto);
    console.log('🛒 Producto agregado al carrito:', producto.marca, producto.modelo);
    alert(`✅ ${producto.marca} ${producto.modelo} agregado al carrito`);
  }
}

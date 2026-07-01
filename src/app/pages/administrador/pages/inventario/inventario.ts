// inventario.ts
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioFiltros } from './inventario-filtros/inventario-filtros';
import { InventarioResumen } from './inventario-resumen/inventario-resumen';
import { InventarioTabla } from './inventario-tabla/inventario-tabla';
import { ProductoService } from '../../../../services/producto.service';
import { ProductoInterface } from '../../../../interfaces/producto.interface';

export interface FiltrosInventario {
  marca: string;
  modelo: string;
  estado: string;
  fecha: string;
  color: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, InventarioFiltros, InventarioResumen, InventarioTabla],
  templateUrl: './inventario.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inventario implements OnInit {
  private productoService = inject(ProductoService);

  productos: ProductoInterface[] = [];
  productosFiltrados: ProductoInterface[] = [];
  marcas: string[] = [];
  colores: string[] = []; // ✅ Lista de colores únicos

  totalProductos: number = 0;
  stockDisponible: number = 0;
  stockBajo: number = 0;
  agotados: number = 0;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (response) => {
        this.productos = response;
        this.productosFiltrados = response;
        this.extraerMarcas();
        this.extraerColores(); // ✅ Extraer colores únicos
        this.calcularEstadisticas();
        console.log('📦 Productos cargados:', this.productos.length);
        console.log('🏷️ Marcas:', this.marcas);
        console.log('🎨 Colores:', this.colores);
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
      },
    });
  }

  extraerMarcas() {
    const marcasSet = new Set<string>();
    this.productos.forEach((p) => {
      if (p.marca) marcasSet.add(p.marca);
    });
    this.marcas = Array.from(marcasSet).sort();
  }

  // ✅ Extraer colores únicos
  extraerColores() {
    const coloresSet = new Set<string>();
    this.productos.forEach((p) => {
      if (p.color) coloresSet.add(p.color);
    });
    this.colores = Array.from(coloresSet).sort();
  }

  calcularEstadisticas() {
    this.totalProductos = this.productosFiltrados.length;
    this.stockDisponible = this.productosFiltrados.reduce((sum, p) => sum + p.stock, 0);
    this.stockBajo = this.productosFiltrados.filter((p) => p.stock > 0 && p.stock < 5).length;
    this.agotados = this.productosFiltrados.filter((p) => p.stock === 0).length;
  }

  onFiltrar(filtros: FiltrosInventario) {
    console.log('🔍 Aplicando filtros:', filtros);

    this.productosFiltrados = this.productos.filter((producto) => {
      let coincide = true;

      if (filtros.marca && producto.marca !== filtros.marca) {
        coincide = false;
      }

      if (filtros.modelo && !producto.modelo.toLowerCase().includes(filtros.modelo.toLowerCase())) {
        coincide = false;
      }

      // ✅ Filtro por color
      if (filtros.color && producto.color !== filtros.color) {
        coincide = false;
      }

      if (filtros.estado && filtros.estado !== 'Todos') {
        if (filtros.estado === 'Disponible' && producto.stock <= 0) coincide = false;
        if (filtros.estado === 'Agotado' && producto.stock > 0) coincide = false;
        if (filtros.estado === 'Stock Bajo' && (producto.stock >= 5 || producto.stock === 0))
          coincide = false;
      }

      return coincide;
    });

    this.calcularEstadisticas();
    console.log('📊 Productos filtrados:', this.productosFiltrados.length);
  }

  onLimpiarFiltros() {
    this.productosFiltrados = [...this.productos];
    this.calcularEstadisticas();
  }
}

export default Inventario;

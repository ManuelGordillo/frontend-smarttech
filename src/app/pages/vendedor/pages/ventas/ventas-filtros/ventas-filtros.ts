import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  output,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../../../services/producto.service'; // Ajusta la ruta según tu estructura
import { ProductoInterface } from '../../../../../interfaces/producto.interface'; // Ajusta la ruta según tu estructura

export interface FiltrosVentas {
  busqueda: string;
  marca: string;
  modelo: string;
  categoria: string;
}

@Component({
  selector: 'smarttech-ventas-filtros',
  imports: [FormsModule],
  templateUrl: './ventas-filtros.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentasFiltros implements OnInit {
  private productoService = inject(ProductoService);

  // Signals para los filtros
  filtroBusqueda = signal('');
  filtroMarca = signal('');
  filtroModelo = signal('');
  filtroCategoria = signal('');

  // Signals para datos dinámicos
  marcas = signal<string[]>([]);
  categorias = signal<string[]>([]);
  productosFiltrados = signal<ProductoInterface[]>([]);

  // Signal para estado de carga
  isLoading = signal(false);

  // Output para comunicar cambios al componente padre
  productosChange = output<ProductoInterface[]>();

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarOpcionesFiltros();
  }

  // Cargar todos los productos inicialmente
  private cargarProductos(): void {
    this.isLoading.set(true);

    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productosFiltrados.set(productos);
        this.productosChange.emit(productos);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.isLoading.set(false);
      },
    });
  }

  // Cargar opciones únicas para filtros
  private cargarOpcionesFiltros(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        // Extraer marcas únicas
        const marcasUnicas = [...new Set(productos.map((p) => p.marca))].filter(Boolean);
        this.marcas.set(marcasUnicas);

        // Extraer categorías únicas
        const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))].filter(Boolean);
        this.categorias.set(categoriasUnicas);
      },
      error: (error) => {
        console.error('Error cargando opciones de filtros:', error);
        // Datos por defecto si falla la carga
        this.marcas.set(['Samsung', 'Apple', 'Xiaomi', 'Motorola']);
        this.categorias.set(['Celulares', 'Tablets', 'Audífonos', 'Accesorios']);
      },
    });
  }

  // Método para aplicar filtros (con debounce opcional)
  aplicarFiltros(): void {
    this.isLoading.set(true);

    const busqueda = this.filtroBusqueda().toLowerCase().trim();
    const marca = this.filtroMarca();
    const modelo = this.filtroModelo().toLowerCase().trim();
    const categoria = this.filtroCategoria();

    // Primero obtener todos los productos
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        // Aplicar filtros en el frontend
        let filtrados = productos;

        // Filtrar por búsqueda (nombre o modelo)
        if (busqueda) {
          filtrados = filtrados.filter(
            (p) =>
              p.marca?.toLowerCase().includes(busqueda) ||
              p.modelo?.toLowerCase().includes(busqueda),
          );
        }

        // Filtrar por marca
        if (marca) {
          filtrados = filtrados.filter((p) => p.marca === marca);
        }

        // Filtrar por modelo
        if (modelo) {
          filtrados = filtrados.filter((p) => p.modelo?.toLowerCase().includes(modelo));
        }

        // Filtrar por categoría
        if (categoria) {
          filtrados = filtrados.filter((p) => p.categoria === categoria);
        }

        this.productosFiltrados.set(filtrados);
        this.productosChange.emit(filtrados);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error aplicando filtros:', error);
        this.isLoading.set(false);
      },
    });
  }

  // Método alternativo: buscar por marca directamente en el backend
  buscarPorMarca(marca: string): void {
    if (!marca) {
      this.cargarProductos();
      return;
    }

    this.isLoading.set(true);
    this.productoService.buscarPorMarca(marca).subscribe({
      next: (productos) => {
        this.productosFiltrados.set(productos);
        this.productosChange.emit(productos);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error buscando por marca:', error);
        this.isLoading.set(false);
      },
    });
  }

  // Método para limpiar todos los filtros
  limpiarFiltros(): void {
    this.filtroBusqueda.set('');
    this.filtroMarca.set('');
    this.filtroModelo.set('');
    this.filtroCategoria.set('');
    this.cargarProductos();
  }

  // Método para limpiar un filtro específico
  limpiarFiltro(tipo: 'busqueda' | 'marca' | 'modelo' | 'categoria'): void {
    switch (tipo) {
      case 'busqueda':
        this.filtroBusqueda.set('');
        break;
      case 'marca':
        this.filtroMarca.set('');
        break;
      case 'modelo':
        this.filtroModelo.set('');
        break;
      case 'categoria':
        this.filtroCategoria.set('');
        break;
    }
    this.aplicarFiltros();
  }

  // Computed para verificar si hay filtros activos
  filtrosActivos = computed(() => {
    return (
      this.filtroBusqueda() || this.filtroMarca() || this.filtroModelo() || this.filtroCategoria()
    );
  });
}

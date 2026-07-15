import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { CardProducto } from '../../../shared/components/card-producto/card-producto';
import { ProductoInterface } from '../../../interfaces/producto.interface';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-celulares',
  imports: [Navbar, Footer, CardProducto],
  templateUrl: './celulares.html',
})
export class Celulares {
  celulares: ProductoInterface[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarCelulares();
  }

  cargarCelulares() {
    this.loading = true;
    this.error = '';

    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.celulares = productos.filter((p) => p.categoria === 'CELULAR' && p.estado !== false);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar celulares:', err);
        this.error = 'Error al cargar los celulares';
        this.loading = false;
      },
    });
  }

  agregarAlCarrito(producto: ProductoInterface) {
    console.log('🛒 Celular agregado al carrito:', producto);
    // Aquí va tu lógica del carrito
  }

  verDetalle(producto: ProductoInterface) {
    console.log('👁️ Ver detalle del celular:', producto);
    // Aquí va tu navegación al detalle
  }
}

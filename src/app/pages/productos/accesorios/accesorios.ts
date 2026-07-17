import { Component } from '@angular/core';
import { Footer } from '../../../shared/components/footer/footer';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { ProductoInterface } from '../../../interfaces/producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CardProducto } from '../../../shared/components/card-producto/card-producto';

@Component({
  selector: 'app-accesorios',
  imports: [Footer, Navbar, CardProducto],
  templateUrl: './accesorios.html',
})
export class Accesorios {
  accesorios: ProductoInterface[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarAccesorios();
  }

  cargarAccesorios() {
    this.loading = true;
    this.error = '';

    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.accesorios = productos.filter(
          (p) => p.categoria === 'ACCESSORIO' && p.estado !== false,
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar accesorios:', err);
        this.error = 'Error al cargar las accesorios';
        this.loading = false;
      },
    });
  }

  agregarAlCarrito(producto: ProductoInterface) {
    console.log('🛒 Accesorio agregada al carrito:', producto);
  }

  verDetalle(producto: ProductoInterface) {
    console.log('👁️ Ver detalle del Accesorio:', producto);
  }
}

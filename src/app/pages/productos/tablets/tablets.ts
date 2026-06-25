import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { ProductoInterface } from '../../../interfaces/producto.interface';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-tablets',
  imports: [Navbar, Footer],
  templateUrl: './tablets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tablets {
  tablets: ProductoInterface[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarTablets();
  }

  cargarTablets() {
    this.loading = true;
    this.error = '';

    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.tablets = productos.filter((p) => p.categoria === 'TABLET' && p.estado !== false);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tablets:', err);
        this.error = 'Error al cargar las tablets';
        this.loading = false;
      },
    });
  }

  agregarAlCarrito(producto: ProductoInterface) {
    console.log('🛒 Tablet agregada al carrito:', producto);
  }

  verDetalle(producto: ProductoInterface) {
    console.log('👁️ Ver detalle de la tablet:', producto);
  }
}

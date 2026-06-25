import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // ← IMPORTANTE: Para location.back()
import { ProductoService } from '../../../../../services/producto.service';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-crear-producto-imagen',
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './crear-producto-imagen.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearProductoImagen {
  // Datos del producto
  producto = {
    modelo: '',
    marca: '',
    descripcion: '',
    color: '',
    categoria: 'CELULAR',
    precio: 0,
    stock: 0,
    serie: '',
  };

  // Archivo de imagen seleccionado
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  fileName: string = '';

  // Estados
  loading: boolean = false;
  error: string = '';
  success: string = '';

  // Categorías disponibles
  categorias = ['CELULAR', 'TABLET', 'AUDIFONO', 'ACCESORIO'];

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private location: Location, // ← INYECTA Location
  ) {}

  // ✅ Volver a la página anterior
  volverAtras() {
    this.location.back();
  }

  // Manejar selección de imagen
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'La imagen no puede superar los 5MB';
        return;
      }

      // Validar tipo
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.error = 'Solo se permiten imágenes JPG, PNG o WEBP';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.error = '';

      // Previsualizar imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Eliminar imagen seleccionada
  eliminarImagen() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileName = '';
    // Resetear el input file
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Enviar formulario
  onSubmit() {
    // Validar campos obligatorios
    if (
      !this.producto.modelo ||
      !this.producto.marca ||
      !this.producto.precio ||
      !this.producto.stock
    ) {
      this.error = 'Por favor, completa todos los campos obligatorios (*)';
      return;
    }

    if (!this.selectedFile) {
      this.error = 'Por favor, selecciona una imagen para el producto';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.productoService.crearProductoConImagen(this.producto, this.selectedFile).subscribe({
      next: (response) => {
        console.log('✅ Producto creado:', response);
        this.success = '✅ Producto creado exitosamente';
        this.loading = false;

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/administrador/dashboard-administrador/productos']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error al crear producto:', err);
        this.error =
          '❌ Error al crear el producto: ' +
          (err.error?.error || err.message || 'Intenta nuevamente');
        this.loading = false;
      },
    });
  }

  // Cancelar y volver
  cancelar() {
    this.router.navigate(['/administrador/dashboard-administrador/productos']);
  }
}

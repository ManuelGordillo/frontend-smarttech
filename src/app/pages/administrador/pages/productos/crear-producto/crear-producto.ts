import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Location, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService } from '../../../../../services/producto.service';

@Component({
  selector: 'app-crear-producto',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './crear-producto.html',
})
export class CrearProducto {
  private location = inject(Location);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);

  loading: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  productoForm = this.fb.group({
    modelo: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    precio: ['', [Validators.required, Validators.min(0)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    categoria: ['', [Validators.required]],
    estado: ['true', [Validators.required]],
    color: ['', [Validators.required]],
  });

  volverAtras() {
    this.location.back();
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const formValue = this.productoForm.value;

    const producto = {
      modelo: formValue.modelo || '',
      marca: formValue.marca || '',
      descripcion: formValue.descripcion || '',
      precio: Number(formValue.precio) || 0,
      stock: Number(formValue.stock) || 0,
      categoria: formValue.categoria?.toUpperCase() || '',
      estado: formValue.estado === 'true',
      color: formValue.color || '',
    };

    console.log('📦 Enviando producto:', producto);

    this.productoService.crearProducto(producto).subscribe({
      next: (response) => {
        console.log('✅ Producto creado:', response);
        this.mensajeExito = '✅ Producto creado exitosamente';
        this.loading = false;
        this.productoForm.reset();

        setTimeout(() => {
          this.volverAtras();
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error al crear producto:', error);
        this.mensajeError = '❌ Error al crear el producto';
        this.loading = false;
      },
    });
  }
}

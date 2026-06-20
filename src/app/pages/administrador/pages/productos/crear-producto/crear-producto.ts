import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-producto',
  imports: [ReactiveFormsModule],
  templateUrl: './crear-producto.html',
})
export class CrearProducto {
  private location = inject(Location);

  volverAtras() {
    this.location.back();
  }
  private fb = inject(FormBuilder);

  productoForm = this.fb.group({
    modelo: ['', [Validators.required]],

    marca: ['', [Validators.required]],

    descripcion: ['', [Validators.required]],

    precio: ['', [Validators.required, Validators.min(0)]],

    stock: ['', [Validators.required, Validators.min(0)]],

    categoria: ['', [Validators.required]],

    estado: ['', [Validators.required]],

    color: ['', [Validators.required]],
  });

  guardarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const producto = this.productoForm.value;

    console.log('Producto registrado:', producto);

    // Aquí luego irá tu servicio:
    // this.productoService.guardar(producto).subscribe(...)

    this.productoForm.reset();
  }
}

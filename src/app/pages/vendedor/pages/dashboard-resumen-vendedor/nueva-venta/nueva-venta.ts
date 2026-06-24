import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-nueva-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-venta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevaVenta implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ventaForm: FormGroup;
  clienteForm: FormGroup;

  productos: Producto[] = [
    { id: 1, nombre: 'iPhone 17 Pro', precio: 4999, stock: 10 },
    { id: 2, nombre: 'Samsung S25', precio: 3999, stock: 15 },
    { id: 3, nombre: 'Redmi Note 15', precio: 2999, stock: 20 },
    { id: 4, nombre: 'MacBook Pro M4', precio: 8999, stock: 5 },
    { id: 5, nombre: 'iPad Air', precio: 2999, stock: 8 },
  ];

  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '987654321' },
    { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '987654322' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '987654323' },
  ];

  showModalCliente = false;
  loading = false;
  productoSeleccionado: Producto | null = null;
  clienteSeleccionado: Cliente | null = null;

  constructor() {
    this.ventaForm = this.fb.group({
      clienteId: ['', [Validators.required]],
      productoId: ['', [Validators.required]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      metodoPago: ['', [Validators.required]],
      fechaVenta: [new Date().toISOString().split('T')[0], [Validators.required]],
      observaciones: [''],
    });

    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.ventaForm.get('productoId')?.valueChanges.subscribe((id) => {
      if (id) {
        this.productoSeleccionado = this.productos.find((p) => p.id === Number(id)) || null;
      } else {
        this.productoSeleccionado = null;
      }
    });

    this.ventaForm.get('clienteId')?.valueChanges.subscribe((id) => {
      if (id) {
        this.clienteSeleccionado = this.clientes.find((c) => c.id === Number(id)) || null;
      } else {
        this.clienteSeleccionado = null;
      }
    });
  }

  abrirModalCliente() {
    this.showModalCliente = true;
    this.clienteForm.reset();
  }

  cerrarModalCliente() {
    this.showModalCliente = false;
    this.clienteForm.reset();
  }

  crearCliente() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    setTimeout(() => {
      const nuevoCliente = {
        id: this.clientes.length + 1,
        ...this.clienteForm.value,
      };
      this.clientes.push(nuevoCliente);
      this.ventaForm.patchValue({ clienteId: nuevoCliente.id });
      this.cerrarModalCliente();
      this.loading = false;
      alert('✅ Cliente creado exitosamente');
    }, 1000);
  }

  getTotal(): number {
    if (!this.productoSeleccionado || !this.ventaForm.get('cantidad')?.value) {
      return 0;
    }
    const cantidad = this.ventaForm.get('cantidad')?.value || 0;
    return this.productoSeleccionado.precio * cantidad;
  }

  registrarVenta() {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const ventaData = {
      ...this.ventaForm.value,
      total: this.getTotal(),
      fechaVenta: new Date(this.ventaForm.value.fechaVenta).toISOString(),
    };

    console.log('📦 Registrando venta:', ventaData);

    setTimeout(() => {
      this.loading = false;
      alert('✅ Venta registrada exitosamente');
      this.router.navigate(['/vendedor/dashboard']);
    }, 1500);
  }

  isValidField(field: string): boolean {
    const control = this.ventaForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.ventaForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('min')) return 'El valor mínimo es 1';
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('pattern')) return 'Formato inválido';
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return 'Campo inválido';
  }

  isValidClienteField(field: string): boolean {
    const control = this.clienteForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getClienteFieldError(field: string): string {
    const control = this.clienteForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('pattern')) return 'Formato inválido';
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return 'Campo inválido';
  }
}

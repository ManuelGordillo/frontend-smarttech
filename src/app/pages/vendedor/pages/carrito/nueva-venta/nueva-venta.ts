import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../../../services/carrito.service';
import { ClientesInterface } from '../../../../../interfaces/clientes.interface';
import { ProductoInterface } from '../../../../../interfaces/producto.interface';
import { ClientesService } from '../../../../../services/clientes.service';
import { ProductoService } from '../../../../../services/producto.service';

@Component({
  selector: 'smarttech-nueva-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-venta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevaVenta implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public carritoService = inject(CarritoService);
  private clientesService = inject(ClientesService);
  private productoService = inject(ProductoService);

  ventaForm: FormGroup;
  clienteForm: FormGroup;

  productos: ProductoInterface[] = [];
  clientes: ClientesInterface[] = [];
  showModalCliente = false;
  loading = false;
  cargandoClientes = false;
  cargandoProductos = false;
  productoSeleccionado: ProductoInterface | null = null;
  clienteSeleccionado: ClientesInterface | null = null;

  constructor() {
    this.ventaForm = this.fb.group({
      clienteId: ['', [Validators.required]],
      productoId: ['', [Validators.required]],
      cantidad: ['1', [Validators.required, Validators.min(1)]],
      metodoPago: ['', [Validators.required]],
      fechaVenta: [new Date().toISOString().split('T')[0], [Validators.required]],
      observaciones: [''],
    });

    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // ✅ Cargar clientes y productos desde la BD
    this.cargarClientes();
    this.cargarProductos();

    // ✅ Escuchar cambios en productoId
    this.ventaForm.get('productoId')?.valueChanges.subscribe((id) => {
      if (id) {
        this.productoSeleccionado = this.productos.find((p) => p.id === Number(id)) || null;
      } else {
        this.productoSeleccionado = null;
      }
    });

    // ✅ Escuchar cambios en clienteId
    this.ventaForm.get('clienteId')?.valueChanges.subscribe((id) => {
      if (id) {
        this.clienteSeleccionado = this.clientes.find((c) => c.id === Number(id)) || null;
        if (this.clienteSeleccionado) {
          this.carritoService.seleccionarCliente(this.clienteSeleccionado);
        }
      } else {
        this.clienteSeleccionado = null;
      }
    });

    // ✅ Cargar cliente desde el carrito si existe
    const carritoActual = this.carritoService.getCarritoSnapshot();
    if (carritoActual.cliente) {
      this.clienteSeleccionado = carritoActual.cliente;
      this.ventaForm.patchValue({ clienteId: carritoActual.cliente.id });
    }
  }

  // ==========================================
  // CARGAR CLIENTES DESDE LA BD
  // ==========================================
  cargarClientes(): void {
    this.cargandoClientes = true;
    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cargandoClientes = false;
        console.log('✅ Clientes cargados:', this.clientes.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar clientes:', error);
        this.clientes = [];
        this.cargandoClientes = false;
      },
    });
  }

  // ==========================================
  // CARGAR PRODUCTOS DESDE LA BD
  // ==========================================
  cargarProductos(): void {
    this.cargandoProductos = true;
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        // ✅ Filtrar solo productos activos y con stock
        this.productos = productos.filter((p) => p.estado !== false && p.stock > 0);
        this.cargandoProductos = false;
        console.log('✅ Productos cargados:', this.productos.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
        this.productos = [];
        this.cargandoProductos = false;
      },
    });
  }

  // ==========================================
  // ABRIR MODAL CLIENTE
  // ==========================================
  abrirModalCliente() {
    this.showModalCliente = true;
    this.clienteForm.reset();
  }

  // ==========================================
  // CERRAR MODAL CLIENTE
  // ==========================================
  cerrarModalCliente() {
    this.showModalCliente = false;
    this.clienteForm.reset();
  }

  // ==========================================
  // CREAR CLIENTE (GUARDAR EN BD)
  // ==========================================
  crearCliente() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const nuevoCliente = this.clienteForm.value;

    this.clientesService.crearCliente(nuevoCliente).subscribe({
      next: (clienteCreado) => {
        // ✅ Agregar a la lista local
        this.clientes.push(clienteCreado);
        this.ventaForm.patchValue({ clienteId: clienteCreado.id });

        // ✅ Guardar en carrito
        this.carritoService.seleccionarCliente(clienteCreado);

        this.cerrarModalCliente();
        this.loading = false;
        alert('✅ Cliente creado exitosamente');
        console.log('✅ Cliente creado:', clienteCreado);
      },
      error: (error) => {
        console.error('❌ Error al crear cliente:', error);
        this.loading = false;
        alert('❌ Error al crear cliente');
      },
    });
  }

  // ==========================================
  // AGREGAR PRODUCTO AL CARRITO - CORREGIDO ✅
  // ==========================================
  agregarProducto(): void {
    if (!this.productoSeleccionado) {
      alert('⚠️ Selecciona un producto');
      return;
    }

    const cantidad = this.ventaForm.get('cantidad')?.value || 1;

    if (cantidad > this.productoSeleccionado.stock) {
      alert(`⚠️ Stock insuficiente. Disponible: ${this.productoSeleccionado.stock}`);
      return;
    }

    // ✅ CORRECCIÓN: Agregar el producto directamente
    // El CarritoService se encarga de convertirlo a CarritoProducto internamente
    for (let i = 0; i < cantidad; i++) {
      this.carritoService.agregarProducto(this.productoSeleccionado);
    }

    alert(`✅ ${this.productoSeleccionado.modelo} x${cantidad} agregado al carrito`);
    console.log(`🛒 Producto agregado: ${this.productoSeleccionado.modelo} x${cantidad}`);
  }

  // ==========================================
  // IR AL CARRITO
  // ==========================================
  irAlCarrito(): void {
    this.router.navigate(['/vendedor/carrito']);
  }

  // ==========================================
  // REGISTRAR VENTA
  // ==========================================
  registrarVenta() {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      return;
    }

    const carritoActual = this.carritoService.getCarritoSnapshot();

    if (!carritoActual.cliente) {
      alert('⚠️ Selecciona un cliente');
      return;
    }

    if (carritoActual.productos.length === 0) {
      alert('⚠️ Agrega al menos un producto al carrito');
      return;
    }

    this.loading = true;
    const ventaData = {
      cliente: carritoActual.cliente,
      productos: carritoActual.productos,
      total: carritoActual.total,
      metodoPago: this.ventaForm.value.metodoPago,
      fechaVenta: this.ventaForm.value.fechaVenta,
      observaciones: this.ventaForm.value.observaciones,
    };

    console.log('📦 Registrando venta:', ventaData);

    // ✅ Aquí llamarías a tu servicio de ventas
    setTimeout(() => {
      this.loading = false;
      this.carritoService.vaciarProductos();
      alert('✅ Venta registrada exitosamente');
      this.router.navigate(['/vendedor/dashboard']);
    }, 1500);
  }

  // ==========================================
  // TOTAL DEL PRODUCTO ACTUAL
  // ==========================================
  getTotal(): number {
    if (!this.productoSeleccionado) return 0;
    const cantidad = this.ventaForm.get('cantidad')?.value || 0;
    return this.productoSeleccionado.precio * cantidad;
  }

  // ==========================================
  // VALIDACIONES
  // ==========================================
  isValidField(field: string): boolean {
    const control = this.ventaForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.ventaForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('min')) return 'El valor mínimo es 1';
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
    return 'Campo inválido';
  }
}

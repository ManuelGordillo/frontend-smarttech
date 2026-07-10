// services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientesInterface } from '../interfaces/clientes.interface';
import { CarritoProducto, CarritoInterface } from '../interfaces/carrito.interface';
import { ProductoInterface } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private readonly IGV = 0.18;

  // Estado inicial del carrito
  private carritoState: CarritoInterface = {
    cliente: null,
    productos: [],
    subtotal: 0,
    igv: 0,
    total: 0,
  };

  // Subject para emitir cambios
  private carritoSubject = new BehaviorSubject<CarritoInterface>(this.carritoState);
  public carrito$ = this.carritoSubject.asObservable();

  // ==========================================
  // OBTENER CARRITO
  // ==========================================
  getCarrito(): Observable<CarritoInterface> {
    return this.carrito$;
  }

  getCarritoSnapshot(): CarritoInterface {
    return this.carritoSubject.getValue();
  }

  // ==========================================
  // SELECCIONAR CLIENTE
  // ==========================================
  seleccionarCliente(cliente: ClientesInterface): void {
    const currentState = this.carritoSubject.getValue();
    this.carritoSubject.next({
      ...currentState,
      cliente: cliente,
    });
    console.log('✅ Cliente seleccionado:', cliente.nombre, cliente.apellido);
  }

  // ==========================================
  // AGREGAR PRODUCTO (recibe ProductoInterface)
  // ==========================================
  agregarProducto(producto: ProductoInterface): void {
    const currentState = this.carritoSubject.getValue();

    // Convertir ProductoInterface a CarritoProducto
    const productoCarrito: CarritoProducto = {
      id: producto.id!,
      modelo: producto.modelo, // ← Usar modelo
      marca: producto.marca,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen || producto.imagenPrincipal || '',
      stock: producto.stock,
      subtotal: producto.precio,
    };

    const productoExistente = currentState.productos.find((p) => p.id === producto.id);

    let nuevosProductos: CarritoProducto[];

    if (productoExistente) {
      // Si ya existe, aumentar cantidad
      nuevosProductos = currentState.productos.map((p) =>
        p.id === producto.id
          ? {
              ...p,
              cantidad: p.cantidad + 1,
              subtotal: (p.cantidad + 1) * p.precio,
            }
          : p,
      );
    } else {
      // Si no existe, agregar nuevo
      nuevosProductos = [...currentState.productos, productoCarrito];
    }

    this.actualizarTotales(nuevosProductos);
    console.log('✅ Producto agregado:', producto.modelo);
  }

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================
  eliminarProducto(id: number): void {
    const currentState = this.carritoSubject.getValue();
    const nuevosProductos = currentState.productos.filter((p) => p.id !== id);
    this.actualizarTotales(nuevosProductos);
    console.log('🗑️ Producto eliminado:', id);
  }

  // ==========================================
  // ACTUALIZAR CANTIDAD
  // ==========================================
  actualizarCantidad(id: number, cantidad: number): void {
    if (cantidad < 1) {
      this.eliminarProducto(id);
      return;
    }

    const currentState = this.carritoSubject.getValue();
    const nuevosProductos = currentState.productos.map((p) =>
      p.id === id
        ? {
            ...p,
            cantidad: cantidad,
            subtotal: cantidad * p.precio,
          }
        : p,
    );

    this.actualizarTotales(nuevosProductos);
  }

  // ==========================================
  // ACTUALIZAR TOTALES
  // ==========================================
  private actualizarTotales(productos: CarritoProducto[]): void {
    const total = productos.reduce((sum, p) => sum + p.subtotal, 0);
    const igv = total - total / (1 + this.IGV);
    const subtotal = total - igv;

    const currentState = this.carritoSubject.getValue();

    this.carritoSubject.next({
      ...currentState,
      productos: productos,
      subtotal: subtotal,
      igv: igv,
      total: total,
    });

    console.log('📊 Subtotal:', subtotal, 'IGV:', igv, 'Total:', total);
  }

  // ==========================================
  // LIMPIAR CARRITO
  // ==========================================
  limpiarCarrito(): void {
    this.carritoSubject.next({
      cliente: null,
      productos: [],
      subtotal: 0,
      igv: 0,
      total: 0,
    });
    console.log('🗑️ Carrito vaciado');
  }

  // ==========================================
  // VACIAR PRODUCTOS (sin perder cliente)
  // ==========================================
  vaciarProductos(): void {
    const currentState = this.carritoSubject.getValue();
    this.carritoSubject.next({
      ...currentState,
      productos: [],
      subtotal: 0,
      igv: 0,
      total: 0,
    });
    console.log('🗑️ Productos vaciados');
  }
}

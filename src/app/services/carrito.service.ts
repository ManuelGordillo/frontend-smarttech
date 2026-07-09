// services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientesInterface } from '../interfaces/clientes.interface';
import { CarritoProducto, CarritoInterface } from '../interfaces/carrito.interface';

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
  // AGREGAR PRODUCTO
  // ==========================================
  agregarProducto(producto: CarritoProducto): void {
    const currentState = this.carritoSubject.getValue();
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
      nuevosProductos = [
        ...currentState.productos,
        {
          ...producto,
          cantidad: 1,
          subtotal: producto.precio,
        },
      ];
    }

    this.actualizarTotales(nuevosProductos);
    console.log('✅ Producto agregado:', producto.nombre);
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
  // ACTUALIZAR TOTALES (CON IGV INCLUIDO EN PRECIO)
  // ==========================================
  private actualizarTotales(productos: CarritoProducto[]): void {
    // ✅ Total = suma de subtotales (precio con IGV incluido)
    const total = productos.reduce((sum, p) => sum + p.subtotal, 0);

    // ✅ IGV = Total - (Total / 1.18)
    const igv = total - total / (1 + this.IGV);

    // ✅ Subtotal = Total - IGV
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
  // VACIAR CARRITO (sin perder cliente)
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

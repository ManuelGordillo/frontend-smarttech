import { ClientesInterface } from './clientes.interface';

// models/carrito.interface.ts
export interface CarritoProducto {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  imagen: string;
  stock: number;
}

export interface CarritoInterface {
  cliente: ClientesInterface | null;
  productos: CarritoProducto[];
  subtotal: number;
  igv: number;
  total: number;
}

export interface CarritoProducto {
  id: number;
  modelo: string; // ← Cambiar de nombre a modelo
  marca: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  stock?: number;
  subtotal: number;
}

export interface CarritoInterface {
  cliente: any | null;
  productos: CarritoProducto[];
  subtotal: number;
  igv: number;
  total: number;
}

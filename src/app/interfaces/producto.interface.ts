export interface ProductoInterface {
  id: number;
  fechaIngreso?: string;
  imagen?: string;
  modelo: string;
  marca: string;
  descripcion: string;
  color: string;
  categoria: string;
  precio: number;
  stock: number;
  estado?: boolean;
}

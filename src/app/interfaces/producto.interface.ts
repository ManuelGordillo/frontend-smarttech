export interface ProductoInterface {
  id?: number;
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
  imagenes?: ImagenProductoInterface[];
  imagenPrincipal?: string;
}
// Interface para las imágenes
export interface ImagenProductoInterface {
  id: number;
  publicId: string;
  url: string;
  esPrincipal: boolean;
  orden: number;
}

// Interface para crear/editar productos (sin imágenes)
export interface ProductoCreateInterface {
  modelo: string;
  marca: string;
  descripcion: string;
  color: string;
  categoria: string;
  precio: number;
  stock: number;
  serie?: string;
}

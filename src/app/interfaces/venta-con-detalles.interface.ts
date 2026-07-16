export interface VentaConDetalles {
  id_venta: number;
  fecha: string;
  cliente_nombre?: string;
  cliente_documento?: string;
  tipo_comprobante?: string;
  numero_comprobante?: string;
  total: number;
  estado: 'completada' | 'pendiente' | 'cancelada';
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  id_detalle: number;
  id_venta: number;
  id_producto: number;
  precio_unitario: number;
  cantidad: number;
  total: number;
  producto_nombre?: string;
  producto_codigo?: string;
}

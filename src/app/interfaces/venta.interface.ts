// interfaces/venta.interface.ts
export interface VentaInterface {
  id?: number;
  id_cliente: number;
  id_usuario: number;
  fecha_venta: Date;
  total: number;
  tipo_pago: string;
  estado: 'PENDIENTE' | 'COMPLETADO' | 'ANULADO';
}

// interfaces/comprobante.interface.ts
export interface ComprobanteInterface {
  id?: number;
  id_venta: number;
  tipo_comprobante: string; // 'BOLETA' | 'FACTURA'
  serie: string;
  numero: string;
  fecha_emision: string;
  ruc?: string; // Solo para factura
  razon_social?: string; // Solo para factura
  direccion?: string; // Solo para factura
}

// interfaces/detalle-venta.interface.ts
export interface DetalleVentaInterface {
  id?: number;
  id_venta?: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// interfaces/venta-backend.interface.ts
export interface VentaBackendInterface {
  id?: number;
  cliente: { id: number };
  usuario: { id: number };
  fecha_venta: string;
  total: number;
  tipoPago: string;
  estado: string;
}

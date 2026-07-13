// ============================================================
// INTERFACES PARA EL DASHBOARD DEL VENDEDOR
// ============================================================

/**
 * Estadísticas principales del dashboard
 */
export interface EstadisticasDashboard {
  /** Total de ventas del día */
  ventasHoy: number;
  /** Porcentaje de cambio vs ayer */
  cambioHoy: number;
  /** Total de ventas del mes */
  ventasMes: number;
  /** Porcentaje de cambio vs mes anterior */
  cambioMes: number;
  /** Cantidad total de productos vendidos */
  productosVendidos: number;
  /** Diferencia de productos vs mes anterior */
  productosComparados: number;
  /** Cantidad de clientes atendidos */
  clientesAtendidos: number;
  /** Diferencia de clientes vs mes anterior */
  clientesComparados: number;
}

/**
 * Producto para el ranking de más vendidos
 */
export interface ProductoRanking {
  /** Nombre del producto */
  nombre: string;
  /** Unidades vendidas */
  unidades: number;
  /** Ingresos generados */
  ingresos: number;
  /** ID del producto (opcional) */
  productoId?: number | string;
  /** Categoría del producto (opcional) */
  categoria?: string; // ✅ Propiedad opcional
  /** Porcentaje de participación en ventas (opcional) */
  porcentaje?: number;
}

/**
 * Detalle de una venta
 */
export interface DetalleVentaDashboard {
  /** ID del producto */
  productoId?: number | string;
  /** Cantidad vendida */
  cantidad: number;
  /** Precio unitario */
  precio: number;
  /** Subtotal del detalle */
  subtotal?: number;
  /** Información del producto (opcional) */
  producto?: {
    id?: number | string;
    nombre?: string;
    modelo?: string;
    marca?: string;
    precio?: number;
    categoria?: string; // ✅ Agregado 'categoria' como opcional
  };
}

/**
 * Venta para el dashboard
 */
export interface VentaDashboard {
  /** ID de la venta */
  id: number | string;
  /** Fecha de la venta */
  fecha: string;
  /** Total de la venta */
  total: number;
  /** Información del cliente */
  cliente: any;
  /** Detalles de la venta */
  detalles: DetalleVentaDashboard[];
  /** Información del vendedor (opcional) */
  vendedor?: any;
  /** Estado de la venta (opcional) */
  estado?: string;
}

/**
 * Datos para el gráfico de ventas
 */
export interface DatosGraficoVentas {
  /** Etiquetas del eje X (días) */
  etiquetas: string[];
  /** Valores del eje Y (montos) */
  valores: number[];
}

/**
 * Estado de carga del dashboard
 */
export interface DashboardEstado {
  /** Indica si está cargando datos principales */
  cargando: boolean;
  /** Indica si está cargando productos */
  cargandoProductos: boolean;
  /** Indica si está cargando el gráfico */
  cargandoGrafico: boolean;
  /** Mensaje de error si existe */
  error: string | null;
}

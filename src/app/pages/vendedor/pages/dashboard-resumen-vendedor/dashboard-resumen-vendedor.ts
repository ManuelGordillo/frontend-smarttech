import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { finalize } from 'rxjs/operators';

// Importar interfaces
import {
  EstadisticasDashboard,
  ProductoRanking,
  DatosGraficoVentas,
  DashboardEstado,
} from '../../../../interfaces/vendedor-dashboard.interface';

// Importar servicio
import { VentasService } from '../../../../services/ventas.service';
import { CarritoService } from '../../../../services/carrito.service';

// Registrar todos los elementos de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-resumen-vendedor',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard-resumen-vendedor.html',
})
export class DashboardResumenVendedor implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;

  // ============================================================
  // PROPIEDADES PÚBLICAS
  // ============================================================

  /** Estadísticas del dashboard */
  estadisticas: EstadisticasDashboard = {
    ventasHoy: 0,
    cambioHoy: 0,
    ventasMes: 0,
    cambioMes: 0,
    productosVendidos: 0,
    productosComparados: 0,
    clientesAtendidos: 0,
    clientesComparados: 0,
  };

  /** Top productos más vendidos */
  topProductos: ProductoRanking[] = [];

  /** Items en el carrito */
  itemsCarrito: number = 0;

  /** Última actualización */
  ultimaActualizacion: Date = new Date();

  /** Estado de carga del dashboard */
  estado: DashboardEstado = {
    cargando: false,
    cargandoProductos: false,
    cargandoGrafico: false,
    error: null,
  };

  // ============================================================
  // PROPIEDADES PRIVADAS
  // ============================================================

  private graficoInstance: Chart | null = null;
  private intervaloActualizacion: any;
  private periodoActual: number = 7;
  private _todasLasVentas: any[] = [];

  // ============================================================
  // GETTERS PARA EL TEMPLATE
  // ============================================================

  /** Getter para acceder a todas las ventas desde el template */
  get todasLasVentas(): any[] {
    return this._todasLasVentas;
  }

  get hayError(): boolean {
    return this.estado.error !== null;
  }

  get estaCargando(): boolean {
    return this.estado.cargando || this.estado.cargandoProductos;
  }

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private ventasService: VentasService,
    private carritoService: CarritoService,
  ) {}

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  ngOnInit(): void {
    // Suscribirse al carrito para obtener el número de items
    this.carritoService.carrito$.subscribe((carrito) => {
      this.itemsCarrito = carrito.productos.length;
    });

    // Cargar datos iniciales
    this.cargarDatosDashboard();

    // Actualizar cada 5 minutos
    this.intervaloActualizacion = setInterval(() => {
      this.cargarDatosDashboard();
    }, 300000); // 5 minutos
  }

  ngAfterViewInit(): void {
    // Esperar a que el DOM esté listo para crear el gráfico
    setTimeout(() => {
      if (this._todasLasVentas.length > 0) {
        this.crearGrafico(this.periodoActual);
      }
    }, 500);
  }

  ngOnDestroy(): void {
    // Limpiar recursos
    if (this.intervaloActualizacion) {
      clearInterval(this.intervaloActualizacion);
    }
    if (this.graficoInstance) {
      this.graficoInstance.destroy();
    }
  }

  // ============================================================
  // MÉTODO PRINCIPAL: CARGAR DATOS DEL DASHBOARD
  // ============================================================

  private cargarDatosDashboard(): void {
    this.estado.cargando = true;
    this.estado.cargandoProductos = true;
    this.estado.error = null;

    this.ventasService
      .getVentas()
      .pipe(
        finalize(() => {
          this.estado.cargando = false;
          this.estado.cargandoProductos = false;
        }),
      )
      .subscribe({
        next: (ventas: any[]) => {
          console.log('📊 Ventas recibidas:', ventas?.length || 0);

          // ✅ Asegurar que sea un array
          if (Array.isArray(ventas)) {
            this._todasLasVentas = ventas;
          } else {
            console.warn('⚠️ Las ventas no son un array:', ventas);
            this._todasLasVentas = [];
          }

          // Procesar estadísticas
          this.procesarEstadisticas(this._todasLasVentas);

          // Procesar top productos
          this.procesarTopProductos(this._todasLasVentas);

          // Actualizar gráfico
          if (this.graficoInstance) {
            this.actualizarGrafico(this.periodoActual);
          } else if (this._todasLasVentas.length > 0) {
            this.crearGrafico(this.periodoActual);
          }

          this.ultimaActualizacion = new Date();
        },
        error: (error) => {
          console.error('❌ Error cargando ventas:', error);
          this.estado.error = 'Error al cargar los datos del dashboard';
          this._todasLasVentas = [];
        },
      });
  }

  // ============================================================
  // PROCESAR ESTADÍSTICAS DE VENTAS
  // ============================================================

  private procesarEstadisticas(ventas: any[]): void {
    if (!ventas || ventas.length === 0) {
      this.estadisticas = {
        ventasHoy: 0,
        cambioHoy: 0,
        ventasMes: 0,
        cambioMes: 0,
        productosVendidos: 0,
        productosComparados: 0,
        clientesAtendidos: 0,
        clientesComparados: 0,
      };
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    // ✅ Filtrar ventas usando fechaVenta (estructura real del backend)
    const ventasHoy = this.filtrarVentasPorFecha(ventas, hoy, hoy);
    const ventasAyer = this.filtrarVentasPorFecha(
      ventas,
      this.obtenerFechaAyer(hoy),
      this.obtenerFechaAyer(hoy),
    );
    const ventasMes = this.filtrarVentasPorFecha(ventas, inicioMes, hoy);
    const ventasMesAnterior = this.filtrarVentasPorFecha(ventas, inicioMesAnterior, finMesAnterior);

    // Calcular totales
    const totalHoy = this.calcularTotalVentas(ventasHoy);
    const totalAyer = this.calcularTotalVentas(ventasAyer);
    const totalMes = this.calcularTotalVentas(ventasMes);
    const totalMesAnterior = this.calcularTotalVentas(ventasMesAnterior);

    // Calcular cambios porcentuales
    const cambioHoy = totalAyer > 0 ? ((totalHoy - totalAyer) / totalAyer) * 100 : 0;
    const cambioMes =
      totalMesAnterior > 0 ? ((totalMes - totalMesAnterior) / totalMesAnterior) * 100 : 0;

    // Calcular productos vendidos
    const productosVendidos = this.contarProductosVendidos(ventasMes);
    const productosMesAnterior = this.contarProductosVendidos(ventasMesAnterior);

    // Calcular clientes únicos
    const clientesUnicos = this.contarClientesUnicos(ventasMes);
    const clientesMesAnterior = this.contarClientesUnicos(ventasMesAnterior);

    // Actualizar estadísticas
    this.estadisticas = {
      ventasHoy: totalHoy,
      cambioHoy: cambioHoy,
      ventasMes: totalMes,
      cambioMes: cambioMes,
      productosVendidos: productosVendidos,
      productosComparados: productosVendidos - productosMesAnterior,
      clientesAtendidos: clientesUnicos,
      clientesComparados: clientesUnicos - clientesMesAnterior,
    };

    console.log('📊 Estadísticas procesadas:', this.estadisticas);
  }

  // ============================================================
  // PROCESAR TOP PRODUCTOS
  // ============================================================

  private procesarTopProductos(ventas: any[]): void {
    if (!ventas || ventas.length === 0) {
      this.topProductos = [];
      return;
    }

    const mapaProductos = new Map<string, ProductoRanking>();

    ventas.forEach((venta) => {
      // ✅ Verificar si tiene detalles
      const detalles = venta.detalles || [];

      if (detalles.length > 0) {
        detalles.forEach((detalle: any) => {
          // ✅ Obtener información del producto
          const producto = detalle.producto || {};
          const productoId = producto.id || detalle.productoId || 'desconocido';
          const nombreProducto = producto.modelo || producto.nombre || 'Producto sin nombre';
          const cantidad = detalle.cantidad || 1;
          const precio = detalle.precioUnitario || detalle.precio || 0;
          const subtotal = detalle.subtotal || precio * cantidad;

          if (mapaProductos.has(productoId.toString())) {
            const existente = mapaProductos.get(productoId.toString())!;
            existente.unidades += cantidad;
            existente.ingresos += subtotal;
          } else {
            const nuevoProducto: ProductoRanking = {
              nombre: nombreProducto,
              unidades: cantidad,
              ingresos: subtotal,
              productoId: productoId,
              categoria: producto.marca || producto.categoria || 'General',
            };
            mapaProductos.set(productoId.toString(), nuevoProducto);
          }
        });
      }
    });

    // Convertir a array y ordenar por unidades
    const productosArray = Array.from(mapaProductos.values());

    // Calcular porcentajes
    const maxUnidades =
      productosArray.length > 0 ? Math.max(...productosArray.map((p) => p.unidades)) : 0;
    productosArray.forEach((producto) => {
      producto.porcentaje = maxUnidades > 0 ? (producto.unidades / maxUnidades) * 100 : 0;
    });

    this.topProductos = productosArray.sort((a, b) => b.unidades - a.unidades).slice(0, 5);

    console.log('🏆 Top productos:', this.topProductos);
  }

  // ============================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================

  private filtrarVentasPorFecha(ventas: any[], fechaInicio: Date, fechaFin: Date): any[] {
    return ventas.filter((venta) => {
      // ✅ Usar fechaVenta (estructura real del backend)
      const fechaVenta = new Date(venta.fechaVenta || venta.fecha);
      fechaVenta.setHours(0, 0, 0, 0);
      return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
    });
  }

  private obtenerFechaAyer(fecha: Date): Date {
    const ayer = new Date(fecha);
    ayer.setDate(ayer.getDate() - 1);
    return ayer;
  }

  private calcularTotalVentas(ventas: any[]): number {
    return ventas.reduce((sum, venta) => sum + (venta.total || 0), 0);
  }

  private contarProductosVendidos(ventas: any[]): number {
    let total = 0;
    ventas.forEach((venta) => {
      const detalles = venta.detalles || [];
      detalles.forEach((detalle: any) => {
        total += detalle.cantidad || 0;
      });
    });
    return total;
  }

  private contarClientesUnicos(ventas: any[]): number {
    const clientesSet = new Set();
    ventas.forEach((venta) => {
      if (venta.cliente) {
        const clienteId = venta.cliente.id || venta.cliente;
        clientesSet.add(clienteId);
      }
    });
    return clientesSet.size;
  }

  // ============================================================
  // GRÁFICO DE VENTAS
  // ============================================================

  private crearGrafico(periodo: number): void {
    if (!this.salesChartRef) return;

    // ✅ DESTRUIR GRÁFICO ANTERIOR SI EXISTE
    if (this.graficoInstance) {
      this.graficoInstance.destroy();
      this.graficoInstance = null;
    }

    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const datosGrafico = this.obtenerDatosGrafico(periodo);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: datosGrafico.etiquetas,
        datasets: [
          {
            label: 'Ventas',
            data: datosGrafico.valores,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return 'S/ ' + context.parsed.y.toFixed(2);
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return 'S/ ' + value;
              },
            },
          },
        },
      },
    };

    this.graficoInstance = new Chart(ctx, config);
  }

  private actualizarGrafico(periodo: number): void {
    if (!this.graficoInstance) return;

    const datosGrafico = this.obtenerDatosGrafico(periodo);
    this.graficoInstance.data.labels = datosGrafico.etiquetas;
    this.graficoInstance.data.datasets[0].data = datosGrafico.valores;
    this.graficoInstance.update();
  }

  private obtenerDatosGrafico(periodo: number): DatosGraficoVentas {
    const etiquetas: string[] = [];
    const valores: number[] = [];
    const hoy = new Date();

    for (let i = periodo - 1; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      fecha.setHours(0, 0, 0, 0);

      etiquetas.push(fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }));

      // ✅ Usar fechaVenta (estructura real del backend)
      const ventasDia = this._todasLasVentas.filter((venta) => {
        const fechaVenta = new Date(venta.fechaVenta || venta.fecha);
        fechaVenta.setHours(0, 0, 0, 0);
        return fechaVenta.getTime() === fecha.getTime();
      });

      const totalDia = ventasDia.reduce((sum, venta) => sum + (venta.total || 0), 0);
      valores.push(totalDia);
    }

    return { etiquetas, valores };
  }

  // ============================================================
  // MÉTODOS PÚBLICOS
  // ============================================================

  /**
   * Refrescar el dashboard manualmente
   */
  refrescarDashboard(): void {
    this.cargarDatosDashboard();
    this.ultimaActualizacion = new Date();
  }

  /**
   * Cambiar el período del gráfico
   */
  cambiarPeriodo(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.periodoActual = parseInt(select.value, 10);
    this.actualizarGrafico(this.periodoActual);
  }

  /**
   * Navegar a la lista completa de productos
   */
  verTodosLosProductos(): void {
    console.log('📦 Ver todos los productos');
  }
}

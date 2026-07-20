import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'reporte-graficos',
  imports: [CommonModule],
  templateUrl: './reporte-graficos.html',
})
export class ReporteGraficos implements OnChanges, AfterViewInit {
  @Input() ventas: any[] = [];

  @ViewChild('ventasChart') ventasChartRef!: ElementRef;
  @ViewChild('marcasChart') marcasChartRef!: ElementRef;

  private ventasChart: Chart | null = null;
  private marcasChart: Chart | null = null;

  datosPorMes: any[] = [];
  datosPorMarca: any[] = [];

  ngAfterViewInit(): void {
    // Esperar a que la vista esté lista para crear los gráficos
    setTimeout(() => {
      this.crearGraficos();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ventas'] && this.ventas) {
      this.procesarDatos();
      // Recrear gráficos con nuevos datos
      setTimeout(() => {
        this.crearGraficos();
      }, 100);
    }
  }

  procesarDatos(): void {
    // ✅ PROCESAR VENTAS POR MES
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const ventasPorMes: { [key: string]: number } = {};

    this.ventas.forEach((venta: any) => {
      const fecha = new Date(venta.fechaVenta || venta.fecha_venta);
      const mes = meses[fecha.getMonth()];
      ventasPorMes[mes] = (ventasPorMes[mes] || 0) + (venta.total || 0);
    });

    this.datosPorMes = meses.map((mes) => ({
      mes,
      total: ventasPorMes[mes] || 0,
    }));

    // ✅ PROCESAR VENTAS POR MARCA
    const marcas: { [key: string]: number } = {};

    this.ventas.forEach((venta: any) => {
      const detalles = venta.detalles || [];
      detalles.forEach((detalle: any) => {
        const marca = detalle.producto?.marca || 'Sin marca';
        marcas[marca] = (marcas[marca] || 0) + (detalle.cantidad || 0);
      });
    });

    this.datosPorMarca = Object.entries(marcas)
      .map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  crearGraficos(): void {
    // ✅ DESTRUIR GRÁFICOS ANTERIORES
    if (this.ventasChart) {
      this.ventasChart.destroy();
      this.ventasChart = null;
    }
    if (this.marcasChart) {
      this.marcasChart.destroy();
      this.marcasChart = null;
    }

    // ✅ GRÁFICO DE VENTAS POR MES (Barras)
    if (this.ventasChartRef) {
      const ctx = this.ventasChartRef.nativeElement.getContext('2d');
      const labels = this.datosPorMes.map((d) => d.mes);
      const data = this.datosPorMes.map((d) => d.total);

      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ventas (S/)',
              data: data,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Ventas por Mes',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return 'S/ ' + value.toLocaleString();
                },
              },
            },
          },
        },
      };

      this.ventasChart = new Chart(ctx, config);
    }

    // ✅ GRÁFICO DE VENTAS POR MARCA (Torta)
    if (this.marcasChartRef) {
      const ctx = this.marcasChartRef.nativeElement.getContext('2d');
      const labels = this.datosPorMarca.map((d) => d.nombre);
      const data = this.datosPorMarca.map((d) => d.cantidad);
      const colors = [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(249, 115, 22, 0.8)',
      ];

      const config: ChartConfiguration = {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: colors.slice(0, data.length),
              borderColor: '#ffffff',
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Ventas por Marca',
              font: {
                size: 16,
                weight: 'bold',
              },
            },
          },
        },
      };

      this.marcasChart = new Chart(ctx, config);
    }
  }
}

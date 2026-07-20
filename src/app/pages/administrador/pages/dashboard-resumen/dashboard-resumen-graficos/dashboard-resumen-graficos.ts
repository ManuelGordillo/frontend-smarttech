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
  selector: 'dashboard-resumen-graficos',
  imports: [CommonModule],
  templateUrl: './dashboard-resumen-graficos.html',
})
export class DashboardResumenGraficos implements OnChanges, AfterViewInit {
  @Input() datos: any[] = [];
  @Input() totalVentasMes: number = 0;
  @Input() objetivoMensual: number = 108000;

  @ViewChild('ventasChart') ventasChartRef!: ElementRef;

  private chart: Chart | null = null;
  private chartInicializado: boolean = false;

  ngAfterViewInit(): void {
    this.chartInicializado = true;
    setTimeout(() => {
      this.crearGrafico();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      if (this.chartInicializado) {
        setTimeout(() => {
          this.crearGrafico();
        }, 100);
      }
    }
  }

  crearGrafico(): void {
    if (!this.ventasChartRef) return;

    // Destruir gráfico anterior
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const ctx = this.ventasChartRef.nativeElement.getContext('2d');
    const labels = this.datos.map((d) => d.mes);
    const data = this.datos.map((d) => d.total);

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

    this.chart = new Chart(ctx, config);
  }
}

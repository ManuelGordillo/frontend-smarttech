import { Component, inject, OnInit } from '@angular/core';
import { VentasResumen } from './ventas-resumen/ventas-resumen';
import { VentasFiltros } from './ventas-filtros/ventas-filtros';
import { VentasTabla } from './ventas-tabla/ventas-tabla';
import { VentasService } from '../../../../services/ventas.service';

@Component({
  selector: 'app-ventas',
  imports: [VentasResumen, VentasFiltros, VentasTabla],
  templateUrl: './ventas.html',
})
export default class Ventas implements OnInit {
  private ventasService = inject(VentasService);

  ventasFiltradas: any[] = [];
  cargando = false;

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.cargando = true;
    console.log('🔄 Cargando ventas...');

    this.ventasService.getVentas().subscribe({
      next: (data: any) => {
        console.log('✅ Datos recibidos (RAW):', data);
        console.log('🔍 Tipo de data:', typeof data);
        console.log('🔍 Es array?', Array.isArray(data));
        console.log('🔍 data tiene length?', data?.length);

        // ✅ ASEGURAR QUE SEA UN ARRAY
        let ventasArray = [];

        if (Array.isArray(data)) {
          console.log('✅ data es un array directo');
          ventasArray = data;
        } else if (data && typeof data === 'object') {
          console.log('🔍 data es un objeto, buscando array dentro...');
          console.log('🔍 Keys del objeto:', Object.keys(data));

          const possibleArray =
            data.content || data.ventas || data.data || data.lista || data.items;
          if (possibleArray && Array.isArray(possibleArray)) {
            console.log('✅ Encontrado array en:', possibleArray.length);
            ventasArray = possibleArray;
          } else {
            console.log('❌ No se encontró array dentro del objeto');
            // Si no encuentra array, intentar convertir el objeto a array
            ventasArray = Object.values(data).filter(
              (item) => typeof item === 'object' && item !== null,
            );
            console.log('📊 Convertido a array:', ventasArray.length);
          }
        } else {
          console.log('❌ data no es array ni objeto:', data);
          ventasArray = [];
        }

        console.log('📊 Ventas procesadas finales:', ventasArray);
        console.log('📊 Cantidad final:', ventasArray.length);

        this.ventasFiltradas = ventasArray;

        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error:', error);
        console.error('❌ Detalles del error:', error.error);
        this.ventasFiltradas = [];

        this.cargando = false;
      },
    });
  }

  onVerVenta(id: number) {
    console.log('🔍 Ver venta ID:', id);
  }
  aplicarFiltros(filtros: any) {
    console.log('📋 Filtros aplicados:', filtros);
  }
}

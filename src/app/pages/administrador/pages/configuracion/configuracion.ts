import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionResumen } from './configuracion-resumen/configuracion-resumen';
import { ConfiguracionFiltro } from './configuracion-filtro/configuracion-filtro';
import { ConfiguracionTabla } from './configuracion-tabla/configuracion-tabla';
import { ConfiguracionRanking } from './configuracion-ranking/configuracion-ranking';
import { UsuarioService } from '../../../../services/usuario.service';
import { VentasService } from '../../../../services/ventas.service';

@Component({
  selector: 'app-configuracion',
  imports: [
    CommonModule,
    ConfiguracionResumen,
    ConfiguracionFiltro,
    ConfiguracionTabla,
    ConfiguracionRanking,
  ],
  templateUrl: './configuracion.html',
})
export default class Configuracion implements OnInit {
  private usuarioService = inject(UsuarioService);
  private ventasService = inject(VentasService);

  datosResumen = {
    administradores: 0,
    vendedores: 0,
    clientes: 0,
    totalUsuarios: 0,
  };

  usuarios: any[] = [];
  rankingVendedores: any[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // ✅ USAR getUsuarios() en lugar de getVendedores()
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios: any[]) => {
        console.log('👥 Todos los usuarios:', usuarios);
        this.usuarios = usuarios;
        this.procesarResumen(usuarios);
        this.procesarRankingVendedores(usuarios);
      },
      error: (error) => {
        console.error('❌ Error al cargar usuarios:', error);

        // Fallback: si falla, intentar solo vendedores
        this.usuarioService.getVendedores().subscribe({
          next: (vendedores: any[]) => {
            console.log('👥 Vendedores (fallback):', vendedores);
            this.usuarios = vendedores;
            this.procesarResumen(vendedores);
            this.procesarRankingVendedores(vendedores);
          },
          error: (err) => {
            console.error('❌ Error al cargar vendedores:', err);
          },
        });
      },
    });
  }

  procesarResumen(usuarios: any[]): void {
    // ✅ FILTRAR POR ROL
    const admins = usuarios.filter(
      (u: any) => u.rol?.toUpperCase() === 'ADMINISTRADOR' || u.rol?.toUpperCase() === 'ADMIN',
    );
    const vendedores = usuarios.filter((u: any) => u.rol?.toUpperCase() === 'VENDEDOR');
    const clientes = usuarios.filter((u: any) => u.rol?.toUpperCase() === 'CLIENTE');

    console.log('👥 Admins:', admins.length);
    console.log('👥 Vendedores:', vendedores.length);
    console.log('👥 Clientes:', clientes.length);

    this.datosResumen = {
      administradores: admins.length,
      vendedores: vendedores.length,
      clientes: clientes.length,
      totalUsuarios: usuarios.length,
    };

    console.log('📊 Resumen:', this.datosResumen);
  }

  procesarRankingVendedores(usuarios: any[]): void {
    // ✅ FILTRAR SOLO VENDEDORES PARA EL RANKING
    const vendedores = usuarios.filter((u: any) => u.rol?.toUpperCase() === 'VENDEDOR');

    this.ventasService.getVentas().subscribe({
      next: (data: any) => {
        let ventas = Array.isArray(data) ? data : data.content || data.data || [];
        ventas = ventas.filter((v: any) => v.detalles && v.detalles.length > 0);

        const vendedoresMap = new Map<number, any>();

        ventas.forEach((venta: any) => {
          const usuario = venta.usuario;
          if (usuario && usuario.id) {
            if (!vendedoresMap.has(usuario.id)) {
              vendedoresMap.set(usuario.id, {
                id: usuario.id,
                nombre: usuario.nombreUsuario || usuario.nombre || 'Desconocido',
                ventas: 0,
                ingresos: 0,
              });
            }
            const v = vendedoresMap.get(usuario.id);
            v.ventas += 1;
            v.ingresos += venta.total || 0;
          }
        });

        this.rankingVendedores = Array.from(vendedoresMap.values())
          .sort((a, b) => b.ingresos - a.ingresos)
          .slice(0, 10);

        console.log('🏆 Ranking vendedores:', this.rankingVendedores);
      },
      error: (error) => {
        console.error('❌ Error al cargar ventas para ranking:', error);
      },
    });
  }

  aplicarFiltros(filtros: any): void {
    console.log('📋 Filtros aplicados:', filtros);
    this.cargarDatos();
  }
}

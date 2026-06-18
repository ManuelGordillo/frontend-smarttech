import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfiguracionResumen } from './configuracion-resumen/configuracion-resumen';
import { ConfiguracionFiltro } from './configuracion-filtro/configuracion-filtro';
import { ConfiguracionTabla } from './configuracion-tabla/configuracion-tabla';
import { ConfiguracionRanking } from './configuracion-ranking/configuracion-ranking';

@Component({
  selector: 'app-configuracion',
  imports: [ConfiguracionResumen, ConfiguracionFiltro, ConfiguracionTabla, ConfiguracionRanking],
  templateUrl: './configuracion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Configuracion {}

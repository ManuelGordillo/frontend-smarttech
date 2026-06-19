import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SdbConfiguracionCliente } from './sdb-configuracion-cliente/sdb-configuracion-cliente';
import { PerfilCliente } from './perfil-cliente/perfil-cliente';
import { SeguridadCliente } from './seguridad-cliente/seguridad-cliente';
import { SesionesActivasCliente } from './sesiones-activas-cliente/sesiones-activas-cliente';

@Component({
  selector: 'smarttech-configuracion-cliente',
  imports: [SdbConfiguracionCliente, PerfilCliente, SeguridadCliente, SesionesActivasCliente],
  templateUrl: './configuracion-cliente.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfiguracionCliente {}

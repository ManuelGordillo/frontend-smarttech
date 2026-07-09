// tabla-clientes-vendedor.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientesInterface } from '../../../../../interfaces/clientes.interface';

@Component({
  selector: 'smarttech-tabla-clientes-vendedor',
  imports: [CommonModule],
  templateUrl: './tabla-clientes-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaClientesVendedor {
  @Input() clientes: ClientesInterface[] = []; // ✅ Cambiado a ClientesInterface
  @Output() seleccionarCliente = new EventEmitter<ClientesInterface>(); // ✅
  @Input() cargando: boolean = false;
  // Cambiado a ClientesInterface

  onSeleccionar(cliente: ClientesInterface): void {
    this.seleccionarCliente.emit(cliente);
  }
}

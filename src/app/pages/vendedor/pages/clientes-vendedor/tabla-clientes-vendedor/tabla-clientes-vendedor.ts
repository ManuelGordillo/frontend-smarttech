import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientesInterface } from '../../../../../interfaces/clientes.interface';

@Component({
  selector: 'smarttech-tabla-clientes-vendedor',
  imports: [CommonModule],
  templateUrl: './tabla-clientes-vendedor.html',
})
export class TablaClientesVendedor {
  @Input() clientes: ClientesInterface[] = [];
  @Input() cargando: boolean = false;
  @Output() seleccionarCliente = new EventEmitter<ClientesInterface>();

  onSeleccionar(cliente: ClientesInterface): void {
    console.log('📤 Emitiendo cliente seleccionado:', cliente);
    this.seleccionarCliente.emit(cliente);
  }
}

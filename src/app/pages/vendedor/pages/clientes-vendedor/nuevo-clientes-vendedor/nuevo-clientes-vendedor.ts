import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ClientesService } from '../../../../../services/clientes.service';

@Component({
  selector: 'smarttech-nuevo-clientes-vendedor',
  imports: [CommonModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './nuevo-clientes-vendedor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoClientesVendedor {
  private fb = inject(FormBuilder);
  private clientesService = inject(ClientesService);

  loading: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  // FORMULARIO REACTIVO CON VALIDACIONES
  clienteForm = this.fb.group({
    dni: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]],
    direccion: [''],
  });

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================
  limpiarFormulario(): void {
    this.clienteForm.reset();
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  // ==========================================
  // GUARDAR CLIENTE
  // ==========================================
  guardarCliente(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.mensajeError = 'Todos los campos son obligatorios';
      return;
    }

    this.loading = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const formValue = this.clienteForm.value;

    const cliente = {
      id: 0,
      dni: formValue.dni || '',
      nombre: formValue.nombre || '',
      apellido: formValue.apellido || '',
      correo: formValue.correo || '',
      telefono: formValue.telefono || '',
      direccion: formValue.direccion || '',
      fechaRegistro: '',
    };

    console.log('📦 Enviando cliente:', cliente);

    this.clientesService.crearCliente(cliente).subscribe({
      next: (response) => {
        console.log('✅ Cliente creado:', response);
        this.mensajeExito = '✅ Cliente registrado exitosamente';
        this.loading = false;
        this.limpiarFormulario();

        setTimeout(() => {
          this.mensajeExito = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error al crear cliente:', error);
        this.mensajeError = '❌ Error al registrar el cliente';
        this.loading = false;
      },
    });
  }
}

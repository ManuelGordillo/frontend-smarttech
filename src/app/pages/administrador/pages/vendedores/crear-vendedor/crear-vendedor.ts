import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UsuarioService } from '../../../../../services/usuario.service';

@Component({
  selector: 'smarttech-crear-vendedor',
  imports: [ReactiveFormsModule],
  templateUrl: './crear-vendedor.html',
})
export class CrearVendedor {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  vendedorForm = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    confirmarContrasena: ['', [Validators.required]],
  });

  guardar() {
    if (this.vendedorForm.invalid) {
      this.vendedorForm.markAllAsTouched();
      return;
    }

    const password = this.vendedorForm.value.contrasena;

    const confirmar = this.vendedorForm.value.confirmarContrasena;

    if (password !== confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // const vendedor = {
    //   nombreUsuario: this.vendedorForm.value.nombreUsuario,
    //   contrasena: this.vendedorForm.value.contrasena,
    //   rol: 'VENDEDOR',
    // };
    const vendedor = {
      nombreUsuario: this.vendedorForm.value.nombreUsuario,
      contrasena: this.vendedorForm.value.contrasena,
    };

    console.log(vendedor);

    this.usuarioService.crearVendedor(vendedor).subscribe({
      next: () => {
        alert('Vendedor registrado correctamente');
        this.vendedorForm.reset();
      },
      // error: () => {
      //   alert('Error al registrar vendedor');
      // },
      error: (err) => {
        console.log('STATUS:', err.status);
        console.log('ERROR:', err.error);
        console.log(err);

        alert('Error al registrar vendedor');
      },
    });
  }
}

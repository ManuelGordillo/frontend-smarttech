import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [ReactiveFormsModule],
  templateUrl: './recuperar-contrasena.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarContrasena {
  private location = inject(Location);

  volverAtras() {
    this.location.back();
  }

  private fb = inject(FormBuilder);

  codigoEnviado = false;

  recuperarForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],

    telefono: [
      '',
      [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
  });

  enviarCodigo() {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    console.log(this.recuperarForm.value);

    this.codigoEnviado = true;
  }
}

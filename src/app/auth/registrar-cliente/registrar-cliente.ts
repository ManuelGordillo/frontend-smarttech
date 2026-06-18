import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-registrar-cliente',
  imports: [ReactiveFormsModule],
  templateUrl: './registrar-cliente.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrarCliente {
  private fb = inject(FormBuilder);

  registerForm: FormGroup = this.fb.group(
    {
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],

      correo: ['', [Validators.required, Validators.email]],

      telefono: ['', Validators.required],

      direccion: ['', Validators.required],

      usuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],

      password: ['', [Validators.required, Validators.minLength(8)]],

      confirmarPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmarPassword = control.get('confirmarPassword')?.value;

    if (password !== confirmarPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  registrar(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log(this.registerForm.value);

    // Aquí llamas tu servicio
  }

  get f() {
    return this.registerForm.controls;
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],

    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = {
      nombreUsuario: this.loginForm.value.usuario,
      contrasena: this.loginForm.value.password,
    };

    this.authService.login(data).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.jwt);
        localStorage.setItem('rol', response.rol);

        switch (response.rol) {
          case 'ADMINISTRADOR':
            this.router.navigate(['/dashboard-administrador']);
            break;

          case 'VENDEDOR':
            this.router.navigate(['/dashboard-vendedor']);
            break;

          case 'CLIENTE':
            this.router.navigate(['/dashboard-cliente']);
            break;
        }
      },

      error: () => {
        alert('Usuario o contraseña incorrectos');
      },
    });
  }
}

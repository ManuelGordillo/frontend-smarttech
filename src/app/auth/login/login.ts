import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private location = inject(Location);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  volverAtras() {
    this.location.back();
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = {
      nombreUsuario: this.loginForm.value.usuario,
      contrasena: this.loginForm.value.password,
    };

    console.log('🔍 Intentando login con:', data);

    this.authService.login(data).subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta del login:', response);
        console.log('📌 Token:', response.jwt); // 🔥 CAMBIADO: jwt en lugar de token
        console.log('📌 Rol:', response.rol);

        // 🔥 CAMBIADO: jwt en lugar de token
        if (response.jwt) {
          const cleanToken = response.jwt.trim();
          localStorage.setItem('token', cleanToken);
          console.log('✅ Token guardado:', cleanToken.substring(0, 30) + '...');
        } else {
          console.error('❌ No se recibió token en la respuesta');
          alert('Error al iniciar sesión: No se recibió token');
          return;
        }

        if (response.rol) {
          localStorage.setItem('rol', response.rol.trim());
          console.log('✅ Rol guardado:', response.rol);
        } else {
          console.error('❌ No se recibió rol en la respuesta');
          alert('Error al iniciar sesión: No se recibió rol');
          return;
        }

        // Redirigir según el rol
        const rol = response.rol.toUpperCase();
        console.log('🔍 Redirigiendo con rol:', rol);

        switch (rol) {
          case 'ADMIN':
          case 'ADMINISTRADOR':
            this.router.navigate(['/administrador/dashboard-administrador']);
            break;
          case 'VENDEDOR':
            this.router.navigate(['/vendedor/vendedor-dashboard']);
            break;
          case 'CLIENTE':
            this.router.navigate(['/cliente/dashboard-cliente']);
            break;
          default:
            console.warn('⚠️ Rol no reconocido:', rol);
            this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        console.error('❌ Detalles:', error.error);
        alert('Usuario o contraseña incorrectos');
      },
    });
  }
}

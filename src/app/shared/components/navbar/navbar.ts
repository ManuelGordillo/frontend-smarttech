import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'smarttech-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private router = inject(Router);

  // 🔥 Método para ir al dashboard según el rol
  irAlDashboard(): void {
    console.log('✅ Click en avatar detectado'); // Para debug

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    console.log('Token:', token);
    console.log('Rol:', rol);

    // Si no hay sesión, ir al login
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Redirigir según el rol
    switch (rol) {
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
        this.router.navigate(['/pagina-principal']);
        break;
    }
  }
}

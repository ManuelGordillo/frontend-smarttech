// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'smarttech-sdb-configuracion-cliente',
//   imports: [CommonModule],
//   templateUrl: './sdb-configuracion-cliente.html',
// })
// export class SdbConfiguracionCliente {
//   seccionActiva: string = 'perfil';

//   cambiarSeccion(seccion: string): void {
//     this.seccionActiva = seccion;
//     // Aquí puedes emitir un evento o usar un servicio para cambiar la vista
//     console.log('📂 Sección:', seccion);
//   }
// }
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'smarttech-sdb-configuracion-cliente',
  imports: [CommonModule],
  templateUrl: './sdb-configuracion-cliente.html',
})
export class SdbConfiguracionCliente {
  private router = inject(Router);

  seccionActiva: string = 'perfil';

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
    console.log('📂 Sección:', seccion);
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('nombre');
      localStorage.removeItem('nombreUsuario');
      localStorage.removeItem('nombreVendedor');
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('clienteId');
      this.router.navigate(['/pagina-principal']);
    }
  }
}

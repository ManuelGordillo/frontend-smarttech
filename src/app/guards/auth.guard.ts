import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = (rolPermitido?: string) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Si no hay token, redirigir al login
  if (!token) {
    router.navigate(['/pagina-principal']);
    return false;
  }

  // Si se requiere un rol específico y no coincide
  if (rolPermitido && rol !== rolPermitido) {
    // Redirigir según el rol que tiene
    if (rol === 'ADMINISTRADOR') {
      router.navigate(['/administrador/dashboard-administrador']);
    } else if (rol === 'VENDEDOR') {
      router.navigate(['/vendedor/dashboard']);
    } else if (rol === 'CLIENTE') {
      router.navigate(['/cliente/dashboard']);
    } else {
      router.navigate(['/pagina-principal']);
    }
    return false;
  }

  return true;
};

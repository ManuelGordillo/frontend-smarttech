import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UsuarioService } from '../../../../services/usuario.service';
import { Vendedor } from '../../../../models/vendedor.model/vendedor.model';

// Validador personalizado: confirmar contraseña
const confirmarContrasenaValidator = (control: AbstractControl): ValidationErrors | null => {
  const parent = control.parent;
  if (!parent) return null;

  const nuevaContrasena = parent.get('nuevaContrasena')?.value;
  const confirmarContrasena = control.value;

  if (nuevaContrasena && confirmarContrasena && nuevaContrasena !== confirmarContrasena) {
    return { contrasenasNoCoinciden: true };
  }
  return null;
};

@Component({
  selector: 'app-configuracion-vendedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracion-vendedor.html',
})
export class ConfiguracionVendedor implements OnInit {
  // ============================================================
  // PROPIEDADES
  // ============================================================

  vendedorActual: Vendedor | null = null;
  cargando: boolean = false;
  cargandoPerfil: boolean = false;
  cargandoContrasena: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  formPerfil!: FormGroup;
  formContrasena!: FormGroup;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
  ) {}

  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarVendedorActual();
  }

  // ============================================================
  // INICIALIZAR FORMULARIOS
  // ============================================================

  private inicializarFormularios(): void {
    // Formulario de perfil - SOLO nombreUsuario
    this.formPerfil = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
    });

    // Formulario de contraseña
    this.formContrasena = this.fb.group({
      contrasenaActual: ['', [Validators.required, Validators.minLength(6)]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required, confirmarContrasenaValidator]],
    });

    // Actualizar validación cuando cambie la nueva contraseña
    this.formContrasena.get('nuevaContrasena')?.valueChanges.subscribe(() => {
      this.formContrasena.get('confirmarContrasena')?.updateValueAndValidity();
    });
  }

  // ============================================================
  // CARGAR VENDEDOR ACTUAL
  // ============================================================

  cargarVendedorActual(): void {
    this.cargando = true;
    this.mensajeError = null;

    const usuarioStr = localStorage.getItem('usuario');
    let vendedorId: number | null = null;

    console.log('📌 Buscando ID en localStorage...');

    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        vendedorId = usuario.id || usuario.vendedorId;
        console.log('📌 ID encontrado en usuario:', vendedorId);
      } catch (e) {
        console.error('Error al parsear usuario', e);
      }
    } else {
      console.warn('⚠️ No hay usuario en localStorage');
    }

    if (vendedorId) {
      console.log('✅ Cargando vendedor con ID:', vendedorId);
      this.usuarioService
        .getVendedorById(vendedorId)
        .pipe(
          finalize(() => {
            this.cargando = false;
          }),
        )
        .subscribe({
          next: (vendedor: Vendedor) => {
            console.log('✅ Vendedor cargado:', vendedor);
            this.vendedorActual = vendedor;
            this.cargarDatosEnFormulario(vendedor);
            localStorage.setItem('vendedor', JSON.stringify(vendedor));
          },
          error: (error) => {
            console.error('❌ Error al cargar vendedor:', error);
            this.mensajeError = 'Error al cargar los datos del vendedor';
          },
        });
    } else {
      this.cargando = false;
      this.mensajeError = 'No se pudo identificar al vendedor';
      console.error('❌ No se encontró ID del vendedor');
    }
  }

  private cargarDatosEnFormulario(vendedor: Vendedor): void {
    if (!vendedor) return;

    console.log('📝 Cargando datos en formulario:', vendedor.nombreUsuario);
    this.formPerfil.patchValue({
      nombreUsuario: vendedor.nombreUsuario || '',
    });
  }

  // ============================================================
  // GUARDAR PERFIL - SOLO nombreUsuario
  // ============================================================

  guardarPerfil(): void {
    console.log('🟢 guardarPerfil() ejecutado');
    console.log('📋 Estado del formulario:', this.formPerfil.status);
    console.log('📋 Valor del formulario:', this.formPerfil.value);

    if (this.formPerfil.invalid) {
      console.warn('⚠️ Formulario inválido');
      this.marcarCamposInvalidos(this.formPerfil);
      return;
    }

    if (!this.vendedorActual?.id) {
      console.error('❌ No se encontró el ID del vendedor');
      this.mensajeError = 'No se encontró el ID del vendedor';
      return;
    }

    this.cargandoPerfil = true;
    this.mensajeExito = null;
    this.mensajeError = null;

    // ✅ SOLO ENVIAR nombreUsuario
    const vendedorActualizado = {
      id: this.vendedorActual.id,
      nombreUsuario: this.formPerfil.get('nombreUsuario')?.value,
    };

    console.log(
      '📤 Enviando actualización al servidor:',
      JSON.stringify(vendedorActualizado, null, 2),
    );
    console.log('🔗 URL:', `http://localhost:8080/usuarios/actualizar/${vendedorActualizado.id}`);

    this.usuarioService
      .actualizarVendedor(vendedorActualizado)
      .pipe(
        finalize(() => {
          this.cargandoPerfil = false;
          console.log('✅ Petición finalizada');
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Respuesta del servidor:', response);
          this.mensajeExito = response?.mensaje || 'Usuario actualizado correctamente';

          // Actualizar el vendedor actual
          if (this.vendedorActual) {
            this.vendedorActual.nombreUsuario = vendedorActualizado.nombreUsuario;
            localStorage.setItem('vendedor', JSON.stringify(this.vendedorActual));
            console.log('✅ Vendedor actualizado en localStorage:', this.vendedorActual);
          }

          setTimeout(() => (this.mensajeExito = null), 3000);
        },
        error: (error) => {
          console.error('❌ Error al actualizar usuario:', error);
          console.error('❌ Detalles del error:', error.error);
          this.mensajeError = error.error?.mensaje || 'Error al actualizar el usuario';
        },
      });
  }

  // ============================================================
  // CAMBIAR CONTRASEÑA
  // ============================================================

  cambiarContrasena(): void {
    console.log('🟢 cambiarContrasena() ejecutado');
    console.log('📋 Estado del formulario contraseña:', this.formContrasena.status);
    console.log('📋 Valor del formulario contraseña:', this.formContrasena.value);

    if (this.formContrasena.invalid) {
      console.warn('⚠️ Formulario de contraseña inválido');
      this.marcarCamposInvalidos(this.formContrasena);
      return;
    }

    if (!this.vendedorActual?.id) {
      console.error('❌ No se encontró el ID del vendedor');
      this.mensajeError = 'No se encontró el ID del vendedor';
      return;
    }

    this.cargandoContrasena = true;
    this.mensajeExito = null;
    this.mensajeError = null;

    const datos = {
      id: this.vendedorActual.id,
      contrasenaActual: this.formContrasena.get('contrasenaActual')?.value,
      nuevaContrasena: this.formContrasena.get('nuevaContrasena')?.value,
    };

    console.log('📤 Enviando cambio de contraseña:', {
      id: datos.id,
      contrasenaActual: '***',
      nuevaContrasena: '***',
    });
    console.log('🔗 URL:', `http://localhost:8080/usuarios/cambiar-contrasena`);

    this.usuarioService
      .cambiarContrasena(datos)
      .pipe(
        finalize(() => {
          this.cargandoContrasena = false;
          console.log('✅ Petición de contraseña finalizada');
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Respuesta del servidor (contraseña):', response);
          this.mensajeExito = response?.mensaje || 'Contraseña actualizada correctamente';
          this.formContrasena.reset();
          setTimeout(() => (this.mensajeExito = null), 3000);
        },
        error: (error) => {
          console.error('❌ Error al cambiar contraseña:', error);
          console.error('❌ Detalles del error:', error.error);

          if (error.status === 400) {
            this.mensajeError = error.error?.mensaje || 'Contraseña actual incorrecta';
          } else if (error.status === 403) {
            this.mensajeError = 'No tienes permisos para cambiar la contraseña';
          } else if (error.status === 401) {
            this.mensajeError = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          } else {
            this.mensajeError = error.error?.mensaje || 'Error al cambiar la contraseña';
          }
        },
      });
  }

  // ============================================================
  // UTILIDADES
  // ============================================================

  private marcarCamposInvalidos(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control && control.invalid) {
        control.markAsTouched();
        console.warn(`⚠️ Campo inválido: ${key}`, control.errors);
      }
    });
    this.mensajeError = 'Por favor, completa todos los campos correctamente';
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('vendedor');
      window.location.href = '/login';
    }
  }

  // ============================================================
  // GETTERS PARA VALIDACIÓN
  // ============================================================

  get nombreUsuarioInvalid(): boolean {
    const control = this.formPerfil.get('nombreUsuario');
    return control ? control.invalid && control.touched : false;
  }

  get contrasenaActualInvalid(): boolean {
    const control = this.formContrasena.get('contrasenaActual');
    return control ? control.invalid && control.touched : false;
  }

  get nuevaContrasenaInvalid(): boolean {
    const control = this.formContrasena.get('nuevaContrasena');
    return control ? control.invalid && control.touched : false;
  }

  get confirmarContrasenaInvalid(): boolean {
    const control = this.formContrasena.get('confirmarContrasena');
    return control ? control.invalid && control.touched : false;
  }

  get contrasenasNoCoinciden(): boolean {
    const control = this.formContrasena.get('confirmarContrasena');
    return control ? control.hasError('contrasenasNoCoinciden') && control.touched : false;
  }
}

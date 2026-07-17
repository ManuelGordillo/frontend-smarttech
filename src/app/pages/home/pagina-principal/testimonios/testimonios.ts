import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'smarttech-testimonios',
  imports: [FormsModule],
  templateUrl: './testimonios.html',
  styleUrls: ['./testimonios.css'],
})
export class Testimonios {
  modalAbierto: boolean = false;
  nombre: string = '';
  comentario: string = '';
  calificacion: number = 5;

  abrirModal() {
    this.modalAbierto = true;
    this.nombre = '';
    this.comentario = '';
    this.calificacion = 5;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.modalAbierto = false;
    document.body.style.overflow = 'auto';
  }

  guardarComentario() {
    if (!this.nombre.trim() || !this.comentario.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    console.log('Nuevo comentario:', {
      nombre: this.nombre,
      comentario: this.comentario,
      calificacion: this.calificacion,
    });

    // Aquí puedes agregar la lógica para guardar el comentario
    this.cerrarModal();
  }
}

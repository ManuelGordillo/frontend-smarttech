import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

interface Pregunta {
  pregunta: string;
  respuesta: string;
  abierta: boolean;
}

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preguntas-frecuentes.html',
})
export class PreguntasFrecuentes {
  constructor(private location: Location) {}

  cerrar() {
    this.location.back();
  }
  preguntas: Pregunta[] = [
    {
      pregunta: '¿Cuánto tiempo tengo para hacer válida la garantía?',
      respuesta:
        'Tienes 7 días hábiles a partir de la fecha de compra para hacer válida la garantía. Recuerda que esta cubre únicamente fallos de fábrica.',
      abierta: false,
    },
    {
      pregunta: '¿La garantía cubre daños por caídas o golpes?',
      respuesta:
        'No, la garantía no cubre caídas, golpes, arañones, manchas de agua o cualquier daño físico. Estos se consideran daños por uso inadecuado y anulan automáticamente la garantía.',
      abierta: false,
    },
    {
      pregunta: '¿Qué pasa si mi equipo tiene un problema de software?',
      respuesta:
        'Si el problema es de fábrica, está cubierto. Sin embargo, si el problema fue causado por instalación de aplicaciones maliciosas, virus, formateo incorrecto, rooteo o jailbreak, la garantía no aplica.',
      abierta: false,
    },
    {
      pregunta: '¿Cómo puedo hacer válida mi garantía?',
      respuesta:
        'Debes presentar el producto en nuestro local con su empaque original, accesorios completos y la boleta o factura de compra. Nuestro equipo técnico evaluará el equipo en 24 a 48 horas.',
      abierta: false,
    },
    {
      pregunta: '¿Qué pasa si el daño es mixto (golpe y falla de fábrica)?',
      respuesta:
        'Si el equipo presenta un golpe o daño físico y además una falla técnica, la garantía se considerará NO VÁLIDA, ya que el golpe es la causa probable del fallo.',
      abierta: false,
    },
    {
      pregunta: '¿Los accesorios tienen garantía?',
      respuesta:
        'Sí, fundas, protectores de pantalla, cables USB, audífonos y cargadores tienen garantía por cambio directo durante los primeros 3 días, siempre que no muestren signos de maltrato.',
      abierta: false,
    },
  ];

  formularioAbierto = false;
  nuevaPregunta = '';
  correoUsuario = '';

  togglePregunta(index: number) {
    // Cerrar todas las demás preguntas (opcional)
    // this.preguntas.forEach((p, i) => {
    //   if (i !== index) p.abierta = false;
    // });

    // Alternar la pregunta actual
    this.preguntas[index].abierta = !this.preguntas[index].abierta;
  }

  abrirFormulario() {
    this.formularioAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarFormulario() {
    this.formularioAbierto = false;
    this.nuevaPregunta = '';
    this.correoUsuario = '';
    document.body.style.overflow = 'auto';
  }

  enviarPregunta() {
    if (this.nuevaPregunta.trim()) {
      console.log('Pregunta enviada:', this.nuevaPregunta);
      console.log('Correo:', this.correoUsuario);

      alert('¡Tu pregunta ha sido enviada! Te responderemos a la brevedad.');
      this.cerrarFormulario();
    }
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Comentario {
  id: number;
  nombre: string;
  texto: string;
  calificacion: number;
  avatar: string;
}

@Component({
  selector: 'smarttech-testimonios',
  imports: [FormsModule, CommonModule],
  templateUrl: './testimonios.html',
  styleUrls: ['./testimonios.css'],
})
export class Testimonios {
  modalAbierto: boolean = false;
  nombre: string = '';
  comentario: string = '';
  calificacion: number = 5;
  contadorId: number = 7;

  // Lista de comentarios iniciales
  comentarios: Comentario[] = [
    {
      id: 1,
      nombre: 'Kenzie Edgar',
      texto:
        'La mejor tienda para comprar tecnología en Lima. Encontré mi celular ideal a un precio increíble y la atención fue excelente. El vendedor me explicó todas las características del equipo y hasta me recomendó un protector de pantalla que ya he probado y funciona perfecto. Definitivamente volveré por una tablet para mi hija.',
      calificacion: 5,
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
    {
      id: 2,
      nombre: 'Stevie Tifft',
      texto:
        'Hice mi pedido por la web y llegó al día siguiente. El producto es original y funcionaba perfecto. También compré un cargador rápido y una funda protectora que son de excelente calidad. Me encanta que tengan tantos accesorios disponibles. Atención rápida y precios justos.',
      calificacion: 4,
      avatar: 'https://i.pravatar.cc/100?img=2',
    },
    {
      id: 3,
      nombre: 'Tommie Ewart',
      texto:
        'Compré unos audífonos inalámbricos y quedé fascinado con la calidad de sonido. El envío fue rápido y el empaque llegó en perfectas condiciones. Además, el precio era mucho mejor que en otras tiendas online. Muy recomendable para quienes buscan calidad y buen servicio.',
      calificacion: 5,
      avatar: 'https://i.pravatar.cc/100?img=3',
    },
    {
      id: 4,
      nombre: 'Charlie Howse',
      texto:
        'Siempre compro aquí mis dispositivos porque sé que son 100% originales y con garantía. El servicio técnico también es muy bueno, ya que me ayudaron a configurar mi nuevo celular y transferir todos mis datos sin problemas. Además, tienen promociones muy buenas en accesorios como fundas y protectores.',
      calificacion: 3,
      avatar: 'https://i.pravatar.cc/100?img=4',
    },
    {
      id: 5,
      nombre: 'Nevada Herbertson',
      texto:
        'Excelente experiencia desde el primer momento. El local es moderno, los productos están bien exhibidos y el personal es muy capacitado. Me asesoraron para elegir una tablet que se ajustara a mi presupuesto y necesidades, y hasta me dieron consejos para cuidar la batería. Sin duda, mi tienda favorita.',
      calificacion: 5,
      avatar: 'https://i.pravatar.cc/100?img=5',
    },
    {
      id: 6,
      nombre: 'Kris Stanton',
      texto:
        'Recomiendo esta tienda a todos mis amigos y familiares. Tienen una gran variedad de celulares, tablets y accesorios de las mejores marcas. El ambiente es agradable y los vendedores son muy atentos y profesionales. Sin duda, la mejor opción para comprar tecnología en la ciudad.',
      calificacion: 4,
      avatar: 'https://i.pravatar.cc/100?img=6',
    },
  ];

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

    // Crear nuevo comentario
    const nuevoComentario: Comentario = {
      id: this.contadorId++,
      nombre: this.nombre,
      texto: this.comentario,
      calificacion: this.calificacion,
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
    };

    // Agregar al inicio (se mostrará primero)
    this.comentarios.unshift(nuevoComentario);

    // Eliminar el último comentario (mantener máximo 6)
    if (this.comentarios.length > 6) {
      this.comentarios.pop();
    }

    console.log('✅ Nuevo comentario agregado:', nuevoComentario);
    console.log('📊 Total comentarios:', this.comentarios.length);

    this.cerrarModal();
  }
}

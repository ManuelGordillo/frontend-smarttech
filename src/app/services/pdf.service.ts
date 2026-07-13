// services/pdf.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CarritoInterface } from '../interfaces/carrito.interface';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  generarBoleta(carrito: CarritoInterface): void {
    const doc = new jsPDF();
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-PE');
    const horaStr = fecha.toLocaleTimeString('es-PE');

    // ==========================================
    // HEADER - DATOS DE LA EMPRESA
    // ==========================================
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('CORPORACION SMART TECH PERU E.I.R.L.', 105, 20, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('CAL. MERCADERES NRO. 224 INT. 106 URB. CERCADO (C.C EL PANORÁMICO)', 105, 28, {
      align: 'center',
    });
    doc.text('AREQUIPA - AREQUIPA - AREQUIPA', 105, 34, { align: 'center' });
    doc.text('RUC 20614819571', 105, 40, { align: 'center' });

    // ==========================================
    // TÍTULO BOLETA
    // ==========================================
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BOLETA DE VENTA ELECTRÓNICA', 105, 50, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`B001-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, 105, 58, {
      align: 'center',
    });

    // ==========================================
    // DATOS DEL CLIENTE (BOLETA - SOLO DNI Y NOMBRE)
    // ==========================================
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENTE', 14, 70);

    doc.setFont('helvetica', 'normal');
    if (carrito.cliente) {
      doc.text(`DNI: ${carrito.cliente.dni}`, 14, 78);
      doc.text(`NOMBRE: ${carrito.cliente.nombre} ${carrito.cliente.apellido}`, 14, 84);
    } else {
      doc.text('DNI: -', 14, 78);
      doc.text('NOMBRE: -', 14, 84);
    }

    // Fecha
    doc.setFont('helvetica', 'bold');
    doc.text('FECHA EMISIÓN:', 140, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(fechaStr, 160, 70);

    doc.setFont('helvetica', 'bold');
    doc.text('MONEDA:', 140, 78);
    doc.setFont('helvetica', 'normal');
    doc.text('SOLES', 160, 78);

    // ==========================================
    // TABLA DE PRODUCTOS
    // ==========================================
    const tableColumn = ['CANT.', 'DESCRIPCIÓN', 'V/U', 'P/U', 'IMPORTE'];
    const tableRows = carrito.productos.map((p) => [
      p.cantidad,
      `${p.modelo} ${p.marca}`,
      `${(p.precio / 1.18).toFixed(3)}`,
      `${p.precio.toFixed(3)}`,
      `${p.subtotal.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 92,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontSize: 8,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 70 },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
      },
    });

    // ==========================================
    // TOTALES
    // ==========================================
    const finalY = (doc as any).lastAutoTable.finalY + 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAVADA', 140, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`S/ ${(carrito.subtotal / 1.18).toFixed(2)}`, 180, finalY, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('IGV 18.00 %', 140, finalY + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(`S/ ${carrito.igv.toFixed(2)}`, 180, finalY + 6, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', 140, finalY + 14);
    doc.text(`S/ ${carrito.total.toFixed(2)}`, 180, finalY + 14, { align: 'right' });

    // ==========================================
    // PIE DE PÁGINA
    // ==========================================
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Representación impresa de la BOLETA ELECTRÓNICA', 105, finalY + 28, {
      align: 'center',
    });
    doc.text('Emitido mediante un PROVEEDOR Autorizado por la SUNAT', 105, finalY + 34, {
      align: 'center',
    });

    // ==========================================
    // DESCARGAR PDF
    // ==========================================
    doc.save(`boleta_${fechaStr.replace(/\//g, '-')}_${carrito.cliente?.dni || 'sin-dni'}.pdf`);
  }

  // ==========================================
  // GENERAR FACTURA (CON DATOS ADICIONALES)
  // ==========================================
  generarFactura(carrito: CarritoInterface, datosFactura: any): void {
    const doc = new jsPDF();
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-PE');
    const horaStr = fecha.toLocaleTimeString('es-PE');

    // ==========================================
    // HEADER - DATOS DE LA EMPRESA
    // ==========================================
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('CORPORACION SMART TECH PERU E.I.R.L.', 105, 20, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('CAL. MERCADERES NRO. 224 INT. 106 URB. CERCADO (C.C EL PANORÁMICO)', 105, 28, {
      align: 'center',
    });
    doc.text('AREQUIPA - AREQUIPA - AREQUIPA', 105, 34, { align: 'center' });
    doc.text('RUC 20614819571', 105, 40, { align: 'center' });

    // ==========================================
    // TÍTULO FACTURA
    // ==========================================
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA ELECTRÓNICA', 105, 50, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`F001-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`, 105, 58, {
      align: 'center',
    });

    // ==========================================
    // DATOS DEL CLIENTE (FACTURA - CON RUC Y RAZÓN SOCIAL)
    // ==========================================
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENTE', 14, 72);

    doc.setFont('helvetica', 'normal');
    if (carrito.cliente) {
      doc.text(`RUC: ${datosFactura.ruc || carrito.cliente.dni}`, 14, 80);
      doc.text(
        `DENOMINACIÓN: ${datosFactura.razonSocial || `${carrito.cliente.nombre} ${carrito.cliente.apellido}`}`,
        14,
        86,
      );
      doc.text(`DIRECCIÓN: ${datosFactura.direccion || 'No registrada'}`, 14, 92);
    } else {
      doc.text('RUC: -', 14, 80);
      doc.text('DENOMINACIÓN: -', 14, 86);
      doc.text('DIRECCIÓN: -', 14, 92);
    }

    // Fechas
    doc.setFont('helvetica', 'bold');
    doc.text('FECHA EMISIÓN:', 140, 72);
    doc.setFont('helvetica', 'normal');
    doc.text(fechaStr, 160, 72);

    doc.setFont('helvetica', 'bold');
    doc.text('FECHA DE VENC.:', 140, 80);
    doc.setFont('helvetica', 'normal');
    const fechaVenc = new Date(fecha);
    fechaVenc.setDate(fechaVenc.getDate() + 1);
    doc.text(fechaVenc.toLocaleDateString('es-PE'), 160, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('MONEDA:', 140, 88);
    doc.setFont('helvetica', 'normal');
    doc.text('SOLES', 160, 88);

    // ==========================================
    // TABLA DE PRODUCTOS
    // ==========================================
    const tableColumn = ['CANT.', 'CÓD.', 'DESCRIPCIÓN', 'V/U', 'P/U', 'IMPORTE'];
    const tableRows = carrito.productos.map((p) => [
      p.cantidad,
      p.id || 'N/A',
      `${p.modelo} ${p.marca}`,
      `${(p.precio / 1.18).toFixed(3)}`,
      `${p.precio.toFixed(3)}`,
      `${p.subtotal.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 100,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontSize: 7,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 55 },
        3: { cellWidth: 22, halign: 'right' },
        4: { cellWidth: 22, halign: 'right' },
        5: { cellWidth: 28, halign: 'right' },
      },
    });

    // ==========================================
    // TOTALES
    // ==========================================
    const finalY = (doc as any).lastAutoTable.finalY + 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAVADA', 140, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`S/ ${(carrito.subtotal / 1.18).toFixed(2)}`, 180, finalY, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('IGV 18.00 %', 140, finalY + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(`S/ ${carrito.igv.toFixed(2)}`, 180, finalY + 6, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', 140, finalY + 14);
    doc.text(`S/ ${carrito.total.toFixed(2)}`, 180, finalY + 14, { align: 'right' });

    // ==========================================
    // TOTAL PAGADO Y LETRAS
    // ==========================================
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAGADO', 14, finalY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`S/ ${carrito.total.toFixed(2)}`, 50, finalY + 8);

    doc.setFont('helvetica', 'bold');
    doc.text('DIFERENCIA (VUELTO)', 14, finalY + 14);
    doc.setFont('helvetica', 'normal');
    doc.text('S/ 0.00', 50, finalY + 14);

    // ==========================================
    // IMPORTE EN LETRAS
    // ==========================================
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const letras = this.numeroALetras(carrito.total);
    doc.text(`IMPORTE EN LETRAS: ${letras} SOLES`, 14, finalY + 24);

    // FORMA DE PAGO
    doc.text(`FORMA DE PAGO: EFECTIVO [CONTADO]: S/${carrito.total.toFixed(1)}`, 14, finalY + 30);

    // ==========================================
    // PIE DE PÁGINA
    // ==========================================
    doc.setFontSize(7);
    doc.text(
      'Representación impresa de la FACTURA ELECTRÓNICA, para ver el documento visita',
      105,
      finalY + 40,
      { align: 'center' },
    );
    doc.text('https://ibccontadores.pse.pe/20614819571', 105, finalY + 46, { align: 'center' });
    doc.text(
      'Emitido mediante un PROVEEDOR Autorizado por la SUNAT mediante Resolución de Intendencia No.034-005-0005315',
      105,
      finalY + 52,
      { align: 'center' },
    );
    doc.text('Página 1 de 1', 105, finalY + 58, { align: 'center' });
    doc.text(
      'Soportado por IBC VILLAR & ASOCIADOS SAC | www.ibc-contadores.com.pe',
      105,
      finalY + 64,
      { align: 'center' },
    );

    // ==========================================
    // DESCARGAR PDF
    // ==========================================
    doc.save(`factura_${fechaStr.replace(/\//g, '-')}_${datosFactura.ruc || 'sin-ruc'}.pdf`);
  }

  // ==========================================
  // CONVERTIR NÚMERO A LETRAS
  // ==========================================
  private numeroALetras(num: number): string {
    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const especiales = [
      'DIEZ',
      'ONCE',
      'DOCE',
      'TRECE',
      'CATORCE',
      'QUINCE',
      'DIECISÉIS',
      'DIECISIETE',
      'DIECIOCHO',
      'DIECINUEVE',
    ];
    const decenas = [
      '',
      '',
      'VEINTI',
      'TREINTA',
      'CUARENTA',
      'CINCUENTA',
      'SESENTA',
      'SETENTA',
      'OCHENTA',
      'NOVENTA',
    ];
    const centenas = [
      '',
      'CIENTO',
      'DOSCIENTOS',
      'TRESCIENTOS',
      'CUATROCIENTOS',
      'QUINIENTOS',
      'SEISCIENTOS',
      'SETECIENTOS',
      'OCHOCIENTOS',
      'NOVECIENTOS',
    ];

    const entero = Math.floor(num);
    const decimal = Math.round((num - entero) * 100);

    if (entero === 0) return 'CERO';

    let resultado = '';

    // Miles
    if (entero >= 1000) {
      const miles = Math.floor(entero / 1000);
      if (miles === 1) {
        resultado += 'MIL ';
      } else {
        resultado += this.numeroALetras(miles) + ' MIL ';
      }
    }

    // Centenas, decenas y unidades
    let resto = entero % 1000;
    if (resto > 0) {
      const c = Math.floor(resto / 100);
      const d = Math.floor((resto % 100) / 10);
      const u = resto % 10;

      if (c > 0) {
        if (c === 1 && resto % 100 === 0) {
          resultado += 'CIEN ';
        } else {
          resultado += centenas[c] + ' ';
        }
      }

      if (d > 0 || u > 0) {
        if (resto % 100 < 20 && resto % 100 >= 10) {
          resultado += especiales[(resto % 100) - 10] + ' ';
        } else {
          if (d > 0) {
            if (d === 2 && u > 0) {
              resultado += 'VEINTI' + unidades[u].toLowerCase() + ' ';
            } else {
              resultado += decenas[d] + (u > 0 ? ' Y ' + unidades[u].toLowerCase() : ' ');
            }
          } else if (u > 0) {
            resultado += unidades[u] + ' ';
          }
        }
      }
    }

    // Decimales
    if (decimal > 0) {
      resultado += `CON ${decimal.toString().padStart(2, '0')}/100`;
    }

    return resultado.trim();
  }
}

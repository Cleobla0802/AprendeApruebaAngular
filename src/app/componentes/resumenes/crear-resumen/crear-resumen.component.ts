import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ApunteService } from '../../../services/apuntes.service';
import { ResumenesService } from '../../../services/resumenes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-resumen',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-resumen.component.html',
  styleUrl: './crear-resumen.component.scss'
})
export class CrearResumenComponent implements OnInit {
  cargando = false; 
  generandoIA = false; 
  uid = '';
  resumenResultado = ''; 
  nuevaCategoria = 'matematicas';
  nuevoTitulo = ''; 
  nuevaDescripcion = '';
  
  listaApuntes: any[] = []; 
  seleccionados: any[] = [];
  
  notif = { show: false, msg: '', type: 'success' };
  mostrarModalConfirmacion = false;
  accionPendiente: 'guardar' | 'limpiar' | null = null;

  categorias = [
    { valor: 'matematicas', nombre: 'Matemáticas' },
    { valor: 'ciencias', nombre: 'Ciencias' },
    { valor: 'ingles', nombre: 'Inglés' },
    { valor: 'historia', nombre: 'Historia' },
    { valor: 'tecnologia', nombre: 'Tecnología' }
  ];

  constructor(private apunteS: ApunteService, private resS: ResumenesService, 
              private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.getUserAuthenticated().subscribe(u => {
      if (u) { this.uid = u.uid; this.cargar(); }
    });
  }

  limpiarResultado() {
    if (this.resumenResultado === '') return;
    this.accionPendiente = 'limpiar';
    this.mostrarModalConfirmacion = true;
  }

  cargar() {
    this.cargando = true;
    this.apunteS.listarApuntesPorUsuario(this.uid).subscribe({
      next: (a) => { this.listaApuntes = a; this.cargando = false; },
      error: () => this.showMsg('Error al cargar apuntes', 'danger')
    });
  }

  toggle(a: any) {
    if (a.contenido === 'Generando sus apuntes, espere...') {
      this.showMsg('Este apunte todavía se está digitalizando, espera a que termine', 'warning');
      return;
    }

    if (this.seleccionados.length && this.seleccionados[0] === a) {
      this.seleccionados = [];
      this.nuevoTitulo = '';
      return;
    }

    this.seleccionados = [a];
    if (a.titulo) {
      this.nuevoTitulo = a.titulo.slice(0, 30);
    }
  }

  crearResumen() {
    if (!this.seleccionados.length) return this.showMsg('Selecciona un apunte', 'warning');
    if (!this.nuevoTitulo.trim()) return this.showMsg('Escribe un título para el resumen', 'warning');

    const apunteSeleccionado = this.seleccionados[0];

    const resumenInicial = {
      titulo: this.nuevoTitulo,
      descripcion: this.nuevaDescripcion,
      resumenTexto: 'Generando sus apuntes, espere...',
      categoria: this.nuevaCategoria || 'general',
      userId: this.uid,
      fecha: new Date().getTime()
    };

    this.resS.guardarResumen(resumenInicial).subscribe({
      next: (resumenGuardado: any) => {
        const idResumen = resumenGuardado.key;

        this.showMsg('¡Resumen creado! Generando contenido en segundo plano...', 'success');
        this.router.navigate(['/componentes/resumenes'])

        const body = `${apunteSeleccionado.titulo}: ${apunteSeleccionado.contenido}`;

        this.resS.generarConIA(body).subscribe({
          next: (r) => {
            const contenido = (!r.resumen || r.resumen.trim() === '' || r.resumen === 'null')
              ? 'La IA no pudo generar el resumen. Edita el contenido manualmente.'
              : r.resumen;
            this.resS.actualizarContenidoResumen(idResumen, contenido).subscribe();
          },
          error: () => {
            this.resS.actualizarContenidoResumen(idResumen, 'Error al generar con IA. Edita el contenido manualmente.').subscribe();
          }
        });
      },
      error: () => this.showMsg('Error al guardar en Firebase', 'danger')
    });
  }

  guardar() {
    if (!this.nuevoTitulo.trim()) return this.showMsg('Escribe un título para tu resumen', 'warning');
    if (!this.resumenResultado) return this.showMsg('No hay contenido para guardar', 'warning');

    this.accionPendiente = 'guardar';
    this.mostrarModalConfirmacion = true;
  }

  cancelarConfirmacion() {
    this.mostrarModalConfirmacion = false;
    this.accionPendiente = null;
  }

  confirmarAccion() {
    if (!this.accionPendiente) return;

    if (this.accionPendiente === 'limpiar') {
      this.resumenResultado = '';
      this.showMsg('Resultado borrado', 'info');
      this.cancelarConfirmacion();
      return;
    }

    const data = {
      titulo: this.nuevoTitulo,
      descripcion: this.nuevaDescripcion,
      resumenTexto: this.resumenResultado,
      categoria: this.nuevaCategoria || 'general',
      userId: this.uid,
      fecha: new Date().getTime()
    };

    this.resS.guardarResumen(data).subscribe({
      next: () => {
        this.showMsg('¡Resumen guardado!', 'success');
        this.cancelarConfirmacion();
        setTimeout(() => this.router.navigate(['/componentes/resumenes']), 1500);
      },
      error: () => {
        this.showMsg('Error al guardar en la base de datos', 'danger');
        this.cancelarConfirmacion();
      }
    });
  }

  showMsg(msg: string, type: string) {
    this.notif = { show: true, msg, type };
    setTimeout(() => this.notif.show = false, 2500);
  }

  volver() {
  this.router.navigate(['/componentes/resumenes']);
  }
}
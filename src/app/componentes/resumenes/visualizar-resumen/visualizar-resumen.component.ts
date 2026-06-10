import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumenesService } from '../../../services/resumenes.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-resumen',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-resumen.component.html'
})
export class VisualizarResumenComponent implements OnInit {
  resumenId: string | null = null;
  resumen: any = null;
  cargando = true;
  guardando = false;

  notif = { show: false, msg: '', type: 'success' as 'success' | 'danger' | 'warning' | 'info' };

  categorias = [
    { valor: 'matematicas', nombre: 'Matemáticas' },
    { valor: 'ciencias', nombre: 'Ciencias' },
    { valor: 'ingles', nombre: 'Inglés' },
    { valor: 'historia', nombre: 'Historia' },
    { valor: 'tecnologia', nombre: 'Tecnología' }
  ];

  constructor(
    private route: ActivatedRoute,
    private resS: ResumenesService,
    private auth: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.resumenId = this.route.snapshot.paramMap.get('id');
    if (this.resumenId) {
      this.cargar();
    }
  }

  cargar() {
    this.cargando = true;
    this.resS.getResumenById(this.resumenId!).subscribe({
      next: (data) => {
        this.resumen = data;
        if (!this.resumen.descripcion) {
          this.resumen.descripcion = '';
        }
        this.cargando = false;
      },
      error: () => {
        this.showMsg('Error al cargar el resumen', 'danger');
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (!this.resumenId || !this.resumen) return;

    if (!this.resumen.titulo?.trim()) {
      return this.showMsg('El título no puede estar vacío', 'warning');
    }

    if (this.resumen.descripcion?.length > 150) {
      return this.showMsg('La descripción no puede superar los 150 caracteres', 'warning');
    }

    this.guardando = true;

    this.resS.actualizarResumen(this.resumenId, this.resumen).subscribe({
      next: () => {
        this.guardando = false;
        this.showMsg('¡Cambios guardados correctamente!', 'success');
      },
      error: () => {
        this.guardando = false;
        this.showMsg('Error al intentar actualizar el resumen', 'danger');
      }
    });
  }

  showMsg(msg: string, type: 'success' | 'danger' | 'warning' | 'info') {
    this.notif = { show: true, msg, type };
    const tiempo = type === 'danger' ? 4000 : 2500;
    setTimeout(() => this.notif.show = false, tiempo);
  }

  volver() {
    this.router.navigate(['/componentes/resumenes']);
  }
}

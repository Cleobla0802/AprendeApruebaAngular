import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumenesService } from '../../../services/resumenes.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-resumen',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-resumen.component.html',
  styleUrl: './visualizar-resumen.component.scss'
})
export class VisualizarResumenComponent implements OnInit {
resumenId: string | null = null;
  resumen: any = null;
  cargando = true;
  notif = { show: false, msg: '', type: 'success' };

  constructor(
    private route: ActivatedRoute,
    private resS: ResumenesService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resumenId = this.route.snapshot.paramMap.get('id');
    if (this.resumenId) this.cargar();
  }

  cargar() {
    this.resS.getResumenById(this.resumenId!).subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargando = false;
      },
      error: () => this.showMsg('Error al cargar', 'danger')
    });
  }

  guardar() {
    if (!this.resumenId || !this.resumen) return;
    
    this.resS.actualizarResumen(this.resumenId, this.resumen).subscribe({
      next: () => this.showMsg('¡Resumen guardado con exito!', 'success'),
      error: () => this.showMsg('Error al actualizar', 'danger')
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

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApunteService } from '../../../services/apuntes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-apuntes',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-apuntes.component.html',
  styleUrl: './visualizar-apuntes.component.scss'
})
export class VisualizarApuntesComponent {
apunte: any = null;
  apunteId: string = '';
  userId: string = '';
  cargando = true;
  guardando = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private apunteService: ApunteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.apunteId = this.route.snapshot.paramMap.get('id') || '';
    
    this.authService.getUserAuthenticated().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.cargarApunte();
      }
    });
  }

  cargarApunte() {
    this.apunteService.getApunteById(this.apunteId).subscribe(data => {
      this.apunte = data;
      this.cargando = false;
    });
  }

  guardarCambios() {
    if (!this.apunte) return;
    this.guardando = true;
    
    // Mantenemos el userId original
    const datos = { ...this.apunte, userId: this.userId };

    this.apunteService.actualizarApunteFirebase(this.apunteId, datos)
      .subscribe({
        next: () => this.guardando = false,
        error: () => this.guardando = false
      });
  }
}

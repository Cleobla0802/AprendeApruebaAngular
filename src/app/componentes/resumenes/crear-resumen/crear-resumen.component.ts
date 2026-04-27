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
cargando = false; generandoIA = false; uid = '';
  resumenResultado = ''; nuevaCategoria = '';
  nuevoTitulo = ''; // Nueva variable para el título del resumen
  listaApuntes: any[] = []; seleccionados: any[] = [];
  
  notif = { show: false, msg: '', type: 'success' };

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
    
    // Simplemente vaciamos las variables
    this.resumenResultado = '';
    this.showMsg('Resultado borrado', 'info');
  }

  cargar() {
    this.cargando = true;
    this.apunteS.listarApuntesPorUsuario(this.uid).subscribe({
      next: (a) => { this.listaApuntes = a; this.cargando = false; },
      error: () => this.showMsg('Error al cargar apuntes', 'danger')
    });
  }

  toggle(a: any) {
    const i = this.seleccionados.indexOf(a);
    i > -1 ? this.seleccionados.splice(i, 1) : this.seleccionados.push(a);
  }

  crearResumen() {
    if (!this.seleccionados.length) return this.showMsg('Selecciona al menos un apunte', 'warning');
    
    this.generandoIA = true;
    const body = this.seleccionados.map(a => `${a.titulo}: ${a.contenido}`).join('\n');

    this.resS.generarConIA(body).subscribe({
      next: (r) => { 
        this.resumenResultado = r.resumen; 
        this.generandoIA = false; 
        this.showMsg('Resumen generado con éxito', 'success');
      },
      error: () => { 
        this.showMsg('Error al conectar con la IA', 'danger'); 
        this.generandoIA = false; 
      }
    });
  }

  guardar() {
    if (!this.nuevoTitulo.trim()) return this.showMsg('Escribe un título para tu resumen', 'warning');
    if (!this.resumenResultado) return this.showMsg('No hay contenido para guardar', 'warning');

    const data = {
      titulo: this.nuevoTitulo,
      resumenTexto: this.resumenResultado, // Asegúrate que el campo coincida con tu interfaz de Firebase
      categoria: this.nuevaCategoria || 'general',
      userId: this.uid,
      fecha: new Date().getTime()
    };

    this.resS.guardarResumen(data).subscribe({
      next: () => {
        this.showMsg('¡Resumen guardado! Redirigiendo...', 'success');
        setTimeout(() => this.router.navigate(['/componentes/resumenes']), 1500);
      },
      error: () => this.showMsg('Error al guardar en la base de datos', 'danger')
    });
  }

  showMsg(msg: string, type: string) {
    this.notif = { show: true, msg, type };
    setTimeout(() => this.notif.show = false, 2500);
  }
}
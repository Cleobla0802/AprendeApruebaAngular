import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { LoginComponent } from '../autenticacion/login/login.component';
import { CommonModule } from '@angular/common';
import { ApuntesComponent } from '../apuntes/apuntes.component';

@Component({
  selector: 'app-presentacion',
  imports: [FooterComponent, LoginComponent, CommonModule, RouterLink],
  templateUrl: './presentacion.component.html',
  styleUrl: './presentacion.component.scss'
})
export class PresentacionComponent {

}

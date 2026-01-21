import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presentacion',
  imports: [FooterComponent, HomeComponent, LoginComponent, CommonModule],
  templateUrl: './presentacion.component.html',
  styleUrl: './presentacion.component.scss'
})
export class PresentacionComponent {
  constructor(private router:Router) {}

  irLogin(){
    this.router.navigate(['componentes/login']);
  }
}

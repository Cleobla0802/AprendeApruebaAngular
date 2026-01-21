import { AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { HomeComponent } from './componentes/home/home.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { SiginComponent } from './componentes/auth/sigin/sigin.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,NavbarComponent, HomeComponent, FooterComponent, PresentacionComponent, LoginComponent, SiginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
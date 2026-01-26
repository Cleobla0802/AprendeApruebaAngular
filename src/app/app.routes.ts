import { Routes } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { SiginComponent } from './componentes/auth/sigin/sigin.component';

export const routes: Routes = [
    {path: 'componentes/presentacion' ,component:PresentacionComponent, data: { showNavbar: false, showFooter: true } },
    {path: 'componentes/auth/login' ,component:LoginComponent, data: { showNavbar: false, showFooter: true }},
    {path: 'componentes/auth/sigin' ,component:SiginComponent, data: { showNavbar: false, showFooter: true }},
    {path: 'componentes/home' ,component:HomeComponent, data: { showNavbar: true, showFooter: true }},
    {path: '',redirectTo:'componentes/presentacion',pathMatch:'full'},
    {path: '**',redirectTo:'componentes/presentacion',pathMatch:'full'}
];

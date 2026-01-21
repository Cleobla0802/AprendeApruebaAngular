import { Routes } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/auth/login/login.component';

export const routes: Routes = [
    {path: 'componentes/presentacion' ,component:PresentacionComponent},
        {path: 'componentes/login' ,component:LoginComponent},
    {path: 'componentes/home' ,component:HomeComponent},
    {path: '',redirectTo:'componentes/presentacion',pathMatch:'full'},
    {path: '**',redirectTo:'componentes/presentacion',pathMatch:'full'}
];

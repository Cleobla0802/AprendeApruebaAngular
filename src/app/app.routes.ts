import { Routes } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { SiginComponent } from './componentes/autenticacion/sigin/sigin.component';
import { ApuntesComponent } from './componentes/apuntes/apuntes.component';
import { VisualizarApuntesComponent } from './componentes/apuntes/visualizar-apuntes/visualizar-apuntes.component';
import { CrearApuntesComponent } from './componentes/apuntes/crear-apuntes/crear-apuntes.component';
import { RecuperarPasswordComponent } from './componentes/autenticacion/recuperar-password/recuperar-password.component';

export const routes: Routes = [
    {path: 'componentes/presentacion' ,component:PresentacionComponent},
    {path: 'componentes/autenticacion/login' ,component:LoginComponent},
    {path: 'componentes/autenticacion/sigin' ,component:SiginComponent},
    {path: 'componentes/autenticacion/recuperar-password' ,component:RecuperarPasswordComponent},
    {path: 'componentes/apuntes' ,component:ApuntesComponent},
    {path: 'componentes/apuntes/visualizar-apuntes', component: VisualizarApuntesComponent},
    {path: 'componentes/apuntes/crear-apuntes', component: CrearApuntesComponent },
    {path: '',redirectTo:'componentes/presentacion',pathMatch:'full'},
    {path: '**',redirectTo:'componentes/presentacion',pathMatch:'full'}
];

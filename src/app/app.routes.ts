import { Routes } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { LoginComponent } from './componentes/auth/login/login.component';
import { SiginComponent } from './componentes/auth/sigin/sigin.component';
import { ApuntesComponent } from './componentes/apuntes/apuntes.component';
import { VisualizarApuntesComponent } from './componentes/apuntes/visualizar-apuntes/visualizar-apuntes.component';
import { CrearApuntesComponent } from './componentes/apuntes/crear-apuntes/crear-apuntes.component';

export const routes: Routes = [
    {path: 'componentes/presentacion' ,component:PresentacionComponent},
    {path: 'componentes/auth/login' ,component:LoginComponent},
    {path: 'componentes/auth/sigin' ,component:SiginComponent},
    {path: 'componentes/apuntes' ,component:ApuntesComponent,
        children: [
      { path: 'componentes/apuntes/visualizar-apuntes', component: VisualizarApuntesComponent },
      { path: 'componentes/apuntes/crear-apuntes', component: CrearApuntesComponent },
      { path: '', redirectTo: 'visualizar', pathMatch: 'full' }
        ]
    },
    {path: '',redirectTo:'componentes/presentacion',pathMatch:'full'},
    {path: '**',redirectTo:'componentes/presentacion',pathMatch:'full'}
];

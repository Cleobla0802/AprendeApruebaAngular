import { Routes } from '@angular/router';
import { PresentacionComponent } from './componentes/presentacion/presentacion.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { SiginComponent } from './componentes/autenticacion/sigin/sigin.component';
import { ApuntesComponent } from './componentes/apuntes/apuntes.component';
import { VisualizarApuntesComponent } from './componentes/apuntes/visualizar-apuntes/visualizar-apuntes.component';
import { CrearApuntesComponent } from './componentes/apuntes/crear-apuntes/crear-apuntes.component';
import { RecuperarPasswordComponent } from './componentes/autenticacion/recuperar-password/recuperar-password.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { CrearNuevaPasswordComponent } from './componentes/autenticacion/recuperar-password/crear-nueva-password/crear-nueva-password.component';
import { ResumenesComponent } from './componentes/resumenes/resumenes.component';
import { CrearResumenComponent } from './componentes/resumenes/crear-resumen/crear-resumen.component';
import { VisualizarResumenComponent } from './componentes/resumenes/visualizar-resumen/visualizar-resumen.component';
import { PruebasTestComponent } from './componentes/pruebas-test/pruebas-test.component';
import { CrearTipoTestComponent } from './componentes/pruebas-test/crear-tipo-test/crear-tipo-test.component';
import { RealizarTipoTestComponent } from './componentes/pruebas-test/realizar-tipo-test/realizar-tipo-test.component';

export const routes: Routes = [
    {path: 'componentes/presentacion' ,component:PresentacionComponent},
    {path: 'componentes/autenticacion/login' ,component:LoginComponent},
    {path: 'componentes/autenticacion/sigin' ,component:SiginComponent},
    {path: 'componentes/autenticacion/recuperar-password' ,component:RecuperarPasswordComponent},
    {path: 'componentes/autenticacion/recuperar-password/crear-nueva-password' ,component:CrearNuevaPasswordComponent},
    
    {path: 'componentes/resumenes' ,component:ResumenesComponent, ...canActivate(()=>redirectUnauthorizedTo('/componentes/autenticacion/login'))},
    {path: 'componentes/resumenes/crear-resumen' ,component:CrearResumenComponent},
    {path: 'componentes/resumenes/visualizar-resumen/:id' ,component:VisualizarResumenComponent},

    {path: 'componentes/apuntes' ,component:ApuntesComponent, ...canActivate(()=>redirectUnauthorizedTo('/componentes/autenticacion/login'))},
    {path: 'componentes/apuntes/visualizar-apuntes/:id', component: VisualizarApuntesComponent},
    {path: 'componentes/apuntes/crear-apuntes', component: CrearApuntesComponent },

    {path: 'componentes/pruebas-test', component: PruebasTestComponent, ...canActivate(()=>redirectUnauthorizedTo('/componentes/autenticacion/login')) },
    {path: 'componentes/pruebas-test/crear-tipo-test', component: CrearTipoTestComponent },
    { path: 'componentes/pruebas-test/realizar-test/:id', component: RealizarTipoTestComponent },

    
    {path: '', redirectTo:'componentes/presentacion', pathMatch:'full'},
    {path: '**', redirectTo:'componentes/presentacion', pathMatch:'full'}
];

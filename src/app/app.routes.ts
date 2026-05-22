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
import { PerfilComponent } from './componentes/autenticacion/perfil/perfil.component';

const soloAutenticado = () => redirectUnauthorizedTo('/componentes/autenticacion/login');

export const routes: Routes = [
    {path: 'componentes/presentacion' ,component:PresentacionComponent},
    {path: 'componentes/autenticacion/login' ,component:LoginComponent},
    {path: 'componentes/autenticacion/sigin' ,component:SiginComponent},
    {path: 'componentes/autenticacion/recuperar-password' ,component:RecuperarPasswordComponent},
    {path: 'componentes/autenticacion/recuperar-password/crear-nueva-password' ,component:CrearNuevaPasswordComponent},
    
    {path: 'componentes/resumenes' ,component:ResumenesComponent, ...canActivate(soloAutenticado)},
    {path: 'componentes/resumenes/crear-resumen' ,component:CrearResumenComponent, ...canActivate(soloAutenticado)},
    {path: 'componentes/resumenes/visualizar-resumen/:id' ,component:VisualizarResumenComponent, ...canActivate(soloAutenticado)},

    {path: 'componentes/apuntes' ,component:ApuntesComponent, ...canActivate(soloAutenticado)},
    {path: 'componentes/apuntes/visualizar-apuntes/:id', component: VisualizarApuntesComponent, ...canActivate(soloAutenticado)},
    {path: 'componentes/apuntes/crear-apuntes', component: CrearApuntesComponent, ...canActivate(soloAutenticado) },

    {path: 'componentes/pruebas-test', component: PruebasTestComponent, ...canActivate(soloAutenticado) },
    {path: 'componentes/pruebas-test/crear-tipo-test', component: CrearTipoTestComponent, ...canActivate(soloAutenticado) },
    {path: 'componentes/pruebas-test/realizar-test/:id', component: RealizarTipoTestComponent, ...canActivate(soloAutenticado) },

    {path: 'componentes/autenticacion/perfil', component: PerfilComponent, ...canActivate(soloAutenticado) },

    {path: '', redirectTo:'componentes/presentacion', pathMatch:'full'},
    {path: '**', redirectTo:'componentes/presentacion', pathMatch:'full'}
];

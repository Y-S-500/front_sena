import { ResultadoAprendizFormComponent } from './demo/pages/operational/resultadoAprendiz/resultado-aprendiz-form/resultado-aprendiz-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import {HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        redirectTo: '/default',
        pathMatch: 'full'
      },
      {
        path: 'default',
        loadComponent: () => import('./demo/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
      {
        path: 'ficha',
        loadComponent: () => import('./demo/pages/operational/ficha/ficha.component').then(m => m.FichaComponent)
      },
      {
        path: 'adashboard/actividad',
        loadComponent: () => import('./demo/pages/operational/actividad/actividad-index/actividad-index.component').then(m => m.ActividadIndexComponent)
      },
      {
        path: 'adashboard/actividad/nuevo',
        loadComponent: () => import('./demo/pages/operational/actividad/actividad-form/actividad-form.component').then(m => m.ActividadFormComponent)
      },
      {
        path: 'adashboard/proyecto',
        loadComponent: () => import('./demo/pages/operational/proyecto/proyecto-index/proyecto-index.component').then(m => m.ProyectoIndexComponent)
      },
      {
        path: 'adashboard/proyecto/nuevo',
        loadComponent: () => import('./demo/pages/operational/proyecto/proyecto-form/proyecto-form.component').then(m => m.ProyectoFormComponent)
      },
      {
        path: 'adashboard/proyecto/editar/:id',
        loadComponent: () => import('./demo/pages/operational/proyecto/proyecto-form/proyecto-form.component').then(m => m.ProyectoFormComponent)
      },
      //competencia
      {
        path: 'adashboard/competencia',
        loadComponent: () => import('./demo/pages/operational/competencia/competencia-index/competencia-index.component').then(m => m.CompetenciaIndexComponent)
      },
      {
        path: 'adashboard/competencia/nuevo',
        loadComponent: () => import('./demo/pages/operational/competencia/competencia-form/competencia-form.component').then(m => m.CompetenciaFormComponent)
      },
      {
        path: 'adashboard/competencia/editar/:id',
        loadComponent: () => import('./demo/pages/operational/competencia/competencia-form/competencia-form.component').then(m => m.CompetenciaFormComponent)
      },

      //resultadoAprendiz
      {
        path: 'adashboard/resultadoAprendiz',
        loadComponent: () => import('./demo/pages/operational/resultadoAprendiz/resultado-aprendiz-index/resultado-aprendiz-index.component').then(m => m.ResultadoAprendizIndexComponent)
      },
      {
        path: 'adashboard/resultadoAprendiz/nuevo',
        loadComponent: () => import('./demo/pages/operational/resultadoAprendiz/resultado-aprendiz-form/resultado-aprendiz-form.component').then(m => m.ResultadoAprendizFormComponent)
      },
      {
        path: 'adashboard/resultadoAprendiz/editar/:id',
        loadComponent: () => import('./demo/pages/operational/resultadoAprendiz/resultado-aprendiz-form/resultado-aprendiz-form.component').then(m => m.ResultadoAprendizFormComponent)
      },
      // CriterioEvaluacion
      {
        path: 'adashboard/criterioEvaluacion',
        loadComponent: () => import('./demo/pages/operational/criterioEvaluacion/criterio-evaluacion-index/criterio-evaluacion-index.component').then(m => m.CriterioEvaluacionIndexComponent)
      },
      {
        path: 'adashboard/criterioEvaluacion/nuevo',
        loadComponent: () => import('./demo/pages/operational/criterioEvaluacion/criterio-evaluacion-form/criterio-evaluacion-form.component').then(m => m.CriterioEvaluacionFormComponent)
      },
      {
        path: 'adashboard/criterioEvaluacion/editar/:id',
        loadComponent: () => import('./demo/pages/operational/criterioEvaluacion/criterio-evaluacion-form/criterio-evaluacion-form.component').then(m => m.CriterioEvaluacionFormComponent)
      },

      // detalle-instrumento-evaluacion
      {
        path: 'adashboard/detalleInstrumentoEvaluacion',
        loadComponent: () => import('./demo/pages/operational/detalle-instrumento-evaluacion/detalle-instrumento-evaluacion-index/detalle-instrumento-evaluacion-index.component').then(m => m.DetalleInstrumentoEvaluacionIndexComponent)
      },
      {
        path: 'adashboard/detalleInstrumentoEvaluacion/nuevo',
        loadComponent: () => import('./demo/pages/operational/detalle-instrumento-evaluacion/detalle-instrumento-evaluacion-form/detalle-instrumento-evaluacion-form.component').then(m => m.DetalleInstrumentoEvaluacionFormComponent)
      },
      {
        path: 'adashboard/detalleInstrumentoEvaluacion/editar/:id',
        loadComponent: () => import('./demo/pages/operational/detalle-instrumento-evaluacion/detalle-instrumento-evaluacion-form/detalle-instrumento-evaluacion-form.component').then(m => m.DetalleInstrumentoEvaluacionFormComponent)
      },

       //instrumento-evaluacion
      {
        path: 'adashboard/instrumentoEvaluacion',
        loadComponent: () => import('./demo/pages/operational/InstrumentoEvaluacion/instrumento-evaluacion-index/instrumento-evaluacion-index.component').then(m => m.InstrumentoEvaluacionIndexComponent)
      },
      {
        path: 'adashboard/instrumentoEvaluacion/nuevo',
        loadComponent: () => import('./demo/pages/operational/InstrumentoEvaluacion/instrumento-evaluacion-form/instrumento-evaluacion-form.component').then(m => m.InstrumentoEvaluacionFormComponent)
      },
      {
        path: 'adashboard/instrumentoEvaluacion/editar/:id',
        loadComponent: () => import('./demo/pages/operational/InstrumentoEvaluacion/instrumento-evaluacion-form/instrumento-evaluacion-form.component').then(m => m.InstrumentoEvaluacionFormComponent)
      },
      //item
      {
        path: 'adashboard/item',
        loadComponent: () => import('./demo/pages/operational/item/item-index/item-index.component').then(m => m.ItemIndexComponent)
      },

       //categoria
      {
        path: 'adashboard/categoria',
        loadComponent: () => import('./demo/pages/operational/categoria/categoria-index/categoria-index.component').then(m => m.CategoriaIndexComponent)
      },
      //instructor
      {
        path: 'adashboard/instructor',
        loadComponent: () => import('./demo/pages/operational/instructores/instructor-index/instructor-index.component').then(m => m.InstructorIndexComponent)
      },
      //programa
      {
        path: 'adashboard/programa',
        loadComponent: () => import('./demo/pages/operational/programa/programa-index/programa-index.component').then(m => m.ProgramaIndexComponent)
      },
       //ficha
       {
        path: 'adashboard/ficha',
        loadComponent: () => import('./demo/pages/operational/fichaNum/ficha-index/ficha-index.component').then(m => m.FichaIndexComponent)
      },
       //ficha
       {
        path: 'adashboard/persona',
        loadComponent: () => import('./demo/pages/operational/persona/persona-index/persona-index.component').then(m => m.PersonaIndexComponent)
      }








    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}

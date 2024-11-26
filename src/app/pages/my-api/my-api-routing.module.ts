import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyApiComponent } from './my-api.component';
import { ListMyApiComponent } from './list-my-api/list-my-api.component';
import { CreateMyApiComponent } from './create-my-api/create-my-api.component';
import { UpdateMyApiComponent } from './update-my-api/update-my-api.component';

const routes: Routes = [
  {
    path: '',
    component: MyApiComponent,
    children: [
      { path: 'list', component: ListMyApiComponent }, // Ruta para listar
      { path: 'create', component: CreateMyApiComponent }, // Ruta para crear
      { path: 'update/:id', component: UpdateMyApiComponent }, // Ruta para actualizar, usando un parámetro id
      { path: '**', redirectTo: 'list' },
    ],
  },
  // { path: '', redirectTo: 'list', pathMatch: 'full' }, // Redirigir a la ruta de listar
  // { path: 'list', component: ListMyApiComponent }, // Ruta para listar
  // { path: 'create', component: CreateMyApiComponent }, // Ruta para crear
  // { path: 'update/:id', component: UpdateMyApiComponent }, // Ruta para actualizar, usando un parámetro id
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyApiRoutingModule {}

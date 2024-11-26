import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DbzComponent } from './pages/dbz/dbz.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { CocktailsComponent } from './pages/cocktails/cocktails.component';
import { MyApiRoutingModule } from './pages/my-api/my-api-routing.module'; // Importa el módulo de rutas
import { AuthGuard } from './guard/auth.guard';


export const routes: Routes = [
   {path: '', redirectTo: 'home', pathMatch: 'full'},
   {path: 'home', component: HomeComponent},
   {path: 'pokemon', component: PokemonComponent},
   {path: 'cocteles', component: CocktailsComponent},
   {path: 'dbz', component: DbzComponent},
  {path: 'miapi', 
   loadChildren: () => import('./pages/my-api/my-api-routing.module').then(m => m.MyApiRoutingModule),
   canActivate: [AuthGuard]
},
   {path: '**', component: MyApiRoutingModule},
];

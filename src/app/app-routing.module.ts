import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NoAuthGuard } from './auth/no-auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'kanban',
    loadChildren: () =>
      import('./kanban/kanban.module').then((m) => m.KanbanModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/kanban' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

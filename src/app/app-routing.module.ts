import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './default/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AdminGuard } from './admin/admin.guard';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { WebsiteComponent } from './website/website.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';

// import { ExportExcelComponent } from './export-file/export-excel/export-excel.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'credentials', component: WebsiteComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'admin-panel', component: AdminPanelComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'recycle-bin', component: RecycleBinComponent, canActivate:[AuthGuard, AdminGuard]},

  // auth routers
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'reset-password', component: ForgotPasswordComponent},
  {path: 'unauthorized', component: UnauthorizedComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { InterviewComponent } from './interview/interview.component';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path:"Home",component:WelcomeComponent},
  {path:"Interview",component:InterviewComponent},
  {path:"error",component:ErrorPageComponent},
  {path:"login",component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

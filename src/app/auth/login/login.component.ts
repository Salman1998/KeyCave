import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error: string = null;
  isLoading: boolean = false;

  private subscriptions: Subscription[] = [];

constructor(private authService: AuthService, private db: AngularFireDatabase){}

  ngOnInit(){

    this.subscriptions.push(
      this.authService.errorMsg.subscribe(error => {
        this.error = error;
        setTimeout(() => {
          this.error = null
        }, 2000)
      })
    )

    this.subscriptions.push(
      this.authService.isLoading.subscribe(loading => {
        this.isLoading = loading;
      })
    )
  }

  onLogin(form: any){
    this.authService.login(form.value.email, form.value.password);
    form.resetForm();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

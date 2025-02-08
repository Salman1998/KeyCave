import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-signup',
  standalone: false,
  
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit, OnDestroy {

  error: string = null;
  isLoading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private db: AngularFireDatabase){}

  ngOnInit(){

    this.subscriptions.push(
      this.authService.errorMsg.subscribe(error => {
        this.error = error;
        console.log(error)
        setTimeout(() => {
          this.error = null
        }, 2000)
      })
    )

    this.subscriptions.push(
      this.authService.isLoading.subscribe(loading => {
        this.isLoading = loading
      })
    )
  }

  onSignup(form: any){
    this.authService.signup(form);
    // form.resetForm();
  }



  ngOnDestroy(){
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
  }
}

import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AutoLogoutService } from './auth/autologout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAuthenticated: boolean = false;
  timeSubscription: Subscription;

  constructor(private authService: AuthService, private autoLogoutService: AutoLogoutService){}

  ngOnInit(){
    this.authService.isAuthenticated.subscribe(auth => {
      this.isAuthenticated = auth.isAuth;
      
      if (this.isAuthenticated) {
        this.timeSubscription = this.autoLogoutService.remainingTime$.subscribe(remainingTime => {
          const minutes = Math.floor((remainingTime / 1000) / 60);
  
          document.title = `KeyCave - less than ${minutes} minutes left until session expired `;
        });
      } else {
        document.title = 'KeyCave';
      }
    })
  }

  ngDestroy(){
    this.timeSubscription.unsubscribe();
  }
}

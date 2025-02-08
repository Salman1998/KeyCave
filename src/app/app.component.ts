import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.authService.isAuthenticated.subscribe(auth => {
      this.isAuthenticated = auth.isAuth;
    })
  }
}

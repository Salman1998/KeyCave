import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private timeoutId: any;
  private readonly logoutTimeLimit = 30 * 60 * 2000; // 30 minutes inactivity
  private remainingTime = this.logoutTimeLimit; // Remaining time in milliseconds
  private countdownInterval: Subscription;

  // BehaviorSubject to track remaining time (observable)
  public remainingTime$: BehaviorSubject<number> = new BehaviorSubject<number>(this.remainingTime);

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) {
    this.startTracking();
  }

  startTracking(): void {
    // Subscribe to auth state changes
    this.afAuth.authState.pipe(
      map(user => {
        // if(user?.uid !== 'TOTm0StcaCe3bPA2PdTv887zEi72'){

        if (user) {
          // User is authenticated, start tracking inactivity
          this.resetTimer();

          // Listen for any user activity
          window.addEventListener('mousemove', () => this.resetTimer());
          window.addEventListener('keydown', () => this.resetTimer());
          window.addEventListener('click', () => this.resetTimer());
          window.addEventListener('scroll', () => this.resetTimer());
        } else {
          // User is not authenticated, stop the timer
          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
          }
          if (this.countdownInterval) {
            this.countdownInterval.unsubscribe();
          }
        }
        // } 
      })
    ).subscribe();
  }

  private resetTimer(): void {
    // Clear the existing timeout and countdown interval
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (this.countdownInterval) {
      this.countdownInterval.unsubscribe();
    }

    this.remainingTime = this.logoutTimeLimit;
    this.startCountdown();

    // Set a new timeout for auto logout
    this.timeoutId = setTimeout(() => {
      this.logout();
    }, this.logoutTimeLimit);
  }

  private startCountdown(): void {
    
    // Start the countdown, emitting the remaining time every second
    this.countdownInterval = interval(1000).subscribe(() => {
      this.remainingTime -= 1000;
      this.remainingTime$.next(this.remainingTime); // Update remaining time

      // If time runs out, trigger the logout
      if (this.remainingTime <= 0) {
        this.logout();
      }
    });
  }

  private logout(): void {
    // Trigger logout when the timeout is reached
    this.ngZone.run(() => {
      this.authService?.logout();
      localStorage.clear();
      this.router.navigate(['/login']); // Redirect to login
      alert('You have been logged out due to inactivity.');
    });
  }
}

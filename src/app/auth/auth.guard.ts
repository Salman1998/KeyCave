import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate{
  
  constructor(private afAuth: AngularFireAuth, private router: Router){}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe( take(1),map(user => !!user?.uid), tap(user => {
      if(user){
        return true;
      }

      this.router.navigate(['/login'])
      return false;
    }))
  }
}

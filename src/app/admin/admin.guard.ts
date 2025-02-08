import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const page = route.routeConfig?.path || '';

    return this.authService.currentUser.pipe(
      take(1),
      switchMap(user => {
        if (user?.type) {
          return this.checkAccessControl(user.type, page);
        }

        // If user.type is not available, fetch it from the database
        return this.afAuth.authState.pipe(
          take(1),
          switchMap(authUser => {
            if (!authUser?.uid) {
              this.redirectToUnauthorized();
              return of(false);
            }
            return this.db.object<string>(`users/${authUser?.uid}/type`).valueChanges().pipe(
              take(1),
              switchMap(userType => {
                // if (!userType || (userType !== 'superuser' && userType !== 'admin')) {
                  if (!userType) {
                  console.log(userType)
                  this.redirectToUnauthorized();
                  return of(false);
                }
                return this.checkAccessControl(userType, page);
              })
            );
          })
        );
      })
    );
  }

  private checkAccessControl(userType: string, page: string): Observable<boolean> {
    return this.db.object<Record<string, string[]>>('accessControls').valueChanges().pipe(
      take(1),
      map(accessControls => {
        const hasAccess = !!(accessControls && accessControls[page]?.includes(userType));
        if (!hasAccess) {
          this.redirectToUnauthorized();
        }
        return hasAccess;
      }),
      // tap(hasAccess => console.log(`Access to '${page}':`, hasAccess))
    );
  }

  private redirectToUnauthorized(): void {
    this.router.navigate(['/unauthorized']);
  }
}


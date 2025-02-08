import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription, take } from 'rxjs';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  
  errorMsg = new Subject<string>();
  isAuthenticated = new BehaviorSubject<{ authEmail: string | null, uid: string | null, isAuth: boolean }>({ authEmail: null, uid: null, isAuth: false });
  isLoading = new BehaviorSubject<boolean>(false);
  currentUser = new BehaviorSubject<UserModel | null>(null);

  private subscriptions: Subscription[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {
    this.trackAuthState();
  }

  /** Tracks authentication state changes */
  private trackAuthState(): void {
    const authSub = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.object<UserModel>(`users/${user.uid}`).valueChanges()
          .pipe(take(1))
          .subscribe(userData => {
            this.currentUser.next(userData); // Emit only when user data is available
            this.isAuthenticated.next({ authEmail: user.email, uid: user.uid, isAuth: !!userData });
          });
      } else {
        const authsub1 = this.afAuth.authState.subscribe(user => {
          this.db.object<UserModel>(`users/${user?.uid}`).valueChanges()
          .pipe(take(1))
          .subscribe(userData => {
            if(!userData){
              this.currentUser.next(null);
              this.isAuthenticated.next({ authEmail: null, uid: null, isAuth: false });
              return
            }
            this.currentUser.next(userData);
            this.isAuthenticated.next({ authEmail: user.email, uid: user.uid, isAuth: !!userData });
          })
        })
        
        this.subscriptions.push(authsub1)
      }
    });
    
    this.subscriptions.push(authSub);
  }

  /** Registers a new user */
  async signup(data: { email: string, password: string, name: string }): Promise<void> {

    this.isLoading.next(true);

    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(data.email, data.password);
      if (userCredential.user) {
        const newUser: any = {
          email: data.email,
          createdAt: new Date().toISOString(),
          uid: userCredential.user.uid,
          name: data.name,
          type: 'user',
        };

        await this.db.object<UserModel>(`users/${userCredential.user.uid}`).set(newUser);
        console.log('User registered successfully!');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading.next(false);
    }
  }

  /** Logs in a user */
  async login(email: string, password: string): Promise<void> {
    this.isLoading.next(true);

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (userCredential.user) {
        this.router.navigate(['/home']);

        const userSub = this.db.object<UserModel>(`users/${userCredential.user.uid}`).valueChanges()
          .subscribe(userData => this.currentUser.next(userData));

        this.subscriptions.push(userSub);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading.next(false);
    }
  }

  /** Logs out the user */
  async logout(): Promise<void> {
    this.isLoading.next(true);
    try {
      await this.afAuth.signOut();
      localStorage.clear();
      this.router.navigate(['/login']);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading.next(false);
    }
  }

  /** Handles authentication errors */
  private handleError(error: any): void {
    let message = 'An unknown error occurred.';

    if (error?.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No user found with this email.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid email or password.';
          break;
        case 'auth/email-already-in-use':
          message = 'This email is already registered.';
          break;
        default:
          message = error.message;
      }
    }

    this.errorMsg.next(message);
    console.error('Firebase Error:', error);
  }

  /** Unsubscribes from all subscriptions to prevent memory leaks */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

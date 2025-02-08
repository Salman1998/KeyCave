  import { Injectable } from "@angular/core";
  import { AngularFireDatabase } from "@angular/fire/compat/database";
  import { BehaviorSubject, Subject, Subscription } from "rxjs";
  import { AngularFireAuth } from "@angular/fire/compat/auth";

  @Injectable({ providedIn: 'root' })
  
  export class AdminCService {
      private readonly userPath = 'users';
      private readonly adminUsersPath = 'adminUsers';
      changedUser = new Subject<any[]>();
      isAdmin = new BehaviorSubject<boolean>(false);
      userSuper = new BehaviorSubject<boolean>(false);
  
      private users: any[] = [];
  
      constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
          this.afAuth.authState.subscribe(user => {
              if (user) {
                  this.checkAdminStatus(user.uid);
              }
          });
      }
  
      fetchData(): void {
          this.db.list(this.userPath).valueChanges().subscribe(users => {
              this.users = users;
              this.changedUser.next(this.users);
          });
      }
  
      editUserData(data: any, key: string): void {
          this.db.object(`${this.userPath}/${key}`).update(data).catch(err => {
              console.error('Error updating user:', err);
          });
      }
  
      deleteUser(key: string): void {
          this.db.object(`${this.userPath}/${key}`).remove().catch(err => {
              console.error('Error deleting user:', err);
          });
      }
  
      private checkAdminStatus(uid: string): void {
          this.db.object(`${this.userPath}/${uid}/type`).valueChanges().subscribe(type => {
              this.isAdmin.next(type === 'admin' || type === 'superuser');
              this.userSuper.next(type === 'superuser');
          });
      }
  }
  
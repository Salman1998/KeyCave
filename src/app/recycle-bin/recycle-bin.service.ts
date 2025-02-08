import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class RecycelBinService implements OnDestroy {

  private url: string = 'recycleBin/users';
  error = new Subject<string>();
  success = new Subject<string>();
  isLoading = new Subject<boolean>();

  changeSeletUser = new Subject<any>();
  private selectUser: any = {}
  
  changeWebsite = new Subject<any>();
  private websites: any = {};
  private currentUser: any = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService, 
    private db: AngularFireDatabase
  ) { 
    const userSub = this.authService.currentUser.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
      this.fetchWebsitesData();
    });

    this.subscriptions.push(userSub);
  }

  fetchWebsitesData(): void {

    this.isLoading.next(true);

    if (!this.currentUser?.uid) return;

    const path = this.currentUser.type === 'superuser' ? this.url : `${this.url}/${this.currentUser.uid}`;

      
      const websiteSub = this.db.object(path).valueChanges().subscribe(data => {

      if(data){

        if(this.currentUser.type === 'superuser'){
          const flattenedData = this.flattenData(data);
          this.setWebsiteData(flattenedData);
          return 
        }
        this.setWebsiteData(data);
        return
      }
    });

    this.db.object(`users`).valueChanges().subscribe(users => {

      this.selectUser =  Object.keys(users).map(uid => ({
          name: users[uid].name,
          uid: users[uid].uid
        }));

        this.setselectUserData(this.selectUser)
    })

    this.subscriptions.push(websiteSub);
    this.isLoading.next(false);

  }

  getWebsites(): any {
    return this.websites
  }

  getUsers(): any {
    return this.selectUser
  }


  // Delete specific website data with error handling
  deleteWebsiteData(deleteKey: string, createBy: string): void {
    this.isLoading.next(true);
  
    this.db.object(`${this.url}/${createBy}/${deleteKey}`).remove()
      .then(() => {
        alert('The website is deleted!');
        this.isLoading.next(false);
    })
      .catch(error => {
        console.log(error)
        // this.handleError(error);
        this.isLoading.next(false);
      });
    
}

private setWebsiteData(websiteData: any): void {
  this.websites = websiteData;
  this.changeWebsite.next({...this.websites});
}

private setselectUserData(users: any): void {
  this.selectUser = users;
  this.changeSeletUser.next({...this.selectUser});
}

  private flattenData(data: any): any {
    let mergedData: any = {};

    Object.values(data).forEach((userWebsites: any) => {
      Object.entries(userWebsites).forEach(([key, value]: [string, any]) => {
        mergedData[key] = value;
      });
    });

    return mergedData;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

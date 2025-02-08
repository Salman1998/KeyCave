import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userData$: Observable<any>;
  

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router){}

  ngOnInit(){


    this.afAuth.authState.subscribe(user => {
      this.userData$ = this.db.object(`users/${user?.uid}`).valueChanges();
    })
  }

}

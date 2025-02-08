import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { saveAs } from 'file-saver';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-export-json',
  templateUrl: './export-json.component.html',
  styleUrls: ['./export-json.component.css']
})
export class ExportJsonComponent implements OnInit {
   user: any ;
    data: any[] = [];
  
  
    constructor(private db: AngularFireDatabase, private authService: AuthService) {}
  
  async  ngOnInit() {
      await this.authService.currentUser.subscribe(user => {
        this.user = user;
      })
  
      if(this.user.type === 'superuser'){
        this.fetchUsersData();
      }else{
        this.fetchUserData()
      }
  
    }

  // Function to export data to JSON file
  exportToJson() {
    if (!this.data || this.data.length === 0) {
      console.error("No data available to export.");
      return;
    }

    const jsonString = JSON.stringify(this.data, null, 2); // Convert to JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    saveAs(blob, 'firebase_data.json');
  }


    // Fetch and transform Firebase data
  private  fetchUsersData() {
      this.db.list(`websites/users`).valueChanges().subscribe((response: any) => {
        this.data = [];
  
        Object.entries(response).forEach(([userId, records]: any) => {
          Object.entries(records).forEach(([recordId, record]: any) => {
            if (typeof record === 'object' && record !== null) {
              this.data.push({ id: recordId, userId, ...record });
            }
          });
        });
  
        // console.log('Formatted Data:', this.data);
      });
    }

  private  fetchUserData() {
      this.db.list(`websites/users/${this.user.uid}`).valueChanges().subscribe((response: any) => {
        this.data = [];
  
        Object.entries(response).forEach(([userId, records]: any) => {
          Object.entries(records).forEach(([recordId, record]: any) => {
            if (typeof record === 'object' && record !== null) {
              this.data.push({ id: recordId, userId, ...record });
            }
          });
        });
  
        // console.log('Formatted Data:', this.data);
      });
    }
}

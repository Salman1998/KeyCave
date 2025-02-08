import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css']
})
export class ExportExcelComponent implements OnInit {

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



  // Function to export data to Excel
  exportToExcel() {

    if (!this.data || this.data.length === 0) {
      console.error("No data available to export.");
      return;
    }

    // Convert data to an Excel worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };

    // Generate Excel file buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save file using file-saver
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'firebase_data.xlsx');
  }




// admin fetch 
private async fetchUsersData() {
  await this.db.list('websites/users').valueChanges().subscribe((response: any) => {
    this.data = [];

    Object.entries(response).forEach(([userId, records]: any) => {
      Object.entries(records).forEach(([recordId, record]: any) => {
        if (typeof record === 'object' && record !== null) {
          this.data.push({ id: recordId, ...record }); // Flatten data
        }
      });
    });

    // console.log('Formatted Data:', this.data); // Debugging purpose
  });
}

// user fetch
private async fetchUserData() {
  
  await this.db.list(`websites/users/${this.user?.uid}`).snapshotChanges().subscribe((response) => {
    this.data = response.map(item => {
      const value = item.payload.val(); // Get the data
      return typeof value === 'object' && value !== null 
        ? { id: item.key, ...value } 
        : { id: item.key, data: value }; // Handle non-object values safely
    });
  });
}








  // data: any[] = [];

  // constructor(private db: AngularFireDatabase) {}

  // ngOnInit() {
  //   this.fetchData();
  // }

  // // Fetch data from Firebase and transform it into an array
  // async fetchData() {
    
  //   await this.db.list('websites/users').snapshotChanges().subscribe((response) => {
  //     this.data = response.map(item => {
  //       const value = item.payload.val(); // Get the data
  //       return typeof value === 'object' && value !== null 
  //         ? { id: item.key, ...value } 
  //         : { id: item.key, data: value }; // Handle non-object values safely
  //     });
  //   });
  // }

  // // Function to export data to Excel
  // exportToExcel() {
    

  //   if (!this.data || this.data.length === 0) {
  //     console.error("No data available to export.");
  //     return;
  //   }

  //   // Convert data to an Excel worksheet
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
  //   const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };

  //   // Generate Excel file buffer
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  //   // Save file using file-saver
  //   const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   saveAs(blob, 'firebase_data.xlsx');
  // }
}

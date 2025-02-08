import { Component } from '@angular/core';
import { AdminPenalService } from './admin.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  role: string = 'superuser'
  accessControlsKey = [];
  accessControls = {};
  selectedRoles = {}; 
  searchText: string = '';

  isLoading = false;
  ischekced = false;
  
  resetAccessControls = {
    'home': ['user', 'admin', 'superuser'],
    'credentials': ['admin', 'superuser'],
    'denials': ['user', 'admin', 'superuser'],
    'admin-panel': ['admin', 'superuser'],
    'insurance-number': ['user', 'admin', 'superuser'],
    'dashboard': ['user', 'admin', 'superuser'],
    'bcbs-prefix': ['user', 'admin', 'superuser'],
    'modifiers': ['user', 'admin', 'superuser'],
    'medigap': ['user', 'admin', 'superuser'],
    'podiatry-denials': ['user', 'admin', 'superuser'],
    'chat': ['user', 'admin', 'superuser'],
    'cloudinary': ['user', 'admin', 'superuser'],
    'refund-mailing': ['user', 'admin', 'superuser'],

    //Availity access control
    'availity': ['admin', 'superuser'],
    'claims': ['admin', 'superuser'],
    'eligibility': ['admin', 'superuser'],
    'remittanceviewer': ['admin', 'superuser'],
    'payerspaces': ['admin', 'superuser'],

    //Clearinghouse access control
    
    'clearinghouse': ['user', 'admin', 'superuser'],
  }

  constructor(
    private adminService: AdminPenalService,
    private db: AngularFireDatabase
  ) {
    this.role = this.adminService.getRole();
    this.adminService.getAccessControls();
    this.adminService.accessControl.subscribe((data) => {
      this.accessControlsKey = data;
    });
    console.log(this.role)
  }

  ngOnInit() {
    
    this.db.object(`accessControls`).valueChanges().subscribe((data) => {
      this.isLoading = true;
      this.accessControls = data;
      this.initializeSelectedRoles();
      this.isLoading = false;
    });
    
  }

  initializeSelectedRoles() {
    this.accessControlsKey.forEach((page) => {
      this.selectedRoles[page] = [...(this.accessControls[page] || [])];
    });
  }

  onCheckboxChange(event, page, role) {
    this.ischekced = true
    if (event.target.checked) {
      if (!this.selectedRoles[page].includes(role)) {
        this.selectedRoles[page].push(role);
      }
    } else {
      this.selectedRoles[page] = this.selectedRoles[page].filter(
        (r) => r !== role
      );
    }
  }

  submitChanges() {
    this.isLoading = true;
    for (const page of this.accessControlsKey) {
      this.updateAccess(page, this.selectedRoles[page]);
    }
    console.log('Access controls updated');  
    this.isLoading = false; 
    this.ischekced = false;
  }

  updateAccess(page, selectedRoles) {
    if (!page || !selectedRoles) {
      console.error('Invalid page or roles');
      return;
    }
    this.adminService.changeAccess(page, selectedRoles);
  }

  onRestAccess() {
    this.isLoading = true;
    this.db.object(`accessControls`).set(this.resetAccessControls).then(() => {
      console.log('Access controls reset successfully!');
      this.isLoading = false;
    }).catch(()=>{
      console.log('Unable to reset access controls!')
      this.isLoading = false;
    });
    this.ischekced = false;
  }

  onClearSearch(){
    this.searchText = '';
  }
}
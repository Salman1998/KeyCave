import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsiteService } from './website.service';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit, OnDestroy {
  websites: Record<string, any> = {};
  selectUser: Record<string, any> = {};
  currentUser: any = {};
  error: string | null = null;
  success: string | null = null;
  isLoading = false;
  role: string = 'user';
  isEdit = false;
  isAdded = false;
  editKey: string | null = null;
  editIndex: number | null = null;
  editValue: any = {};
  passwordVisible = false;
  filterData: string = '';
  selectedUser: string = '';

  private subscriptions: Subscription[] = [];

  constructor(private websiteService: WebsiteService, private authService: AuthService) {}

  ngOnInit(): void {
    this.websiteService.fetchWebsitesData();

    this.subscriptions.push(
      this.websiteService.changeWebsite.subscribe(websites => this.websites = websites),

      
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        if (user.type === 'superuser' || user.type === 'admin') {
          this.role = user.type;
          return
        }

        this.role = 'user';
      }),
      
      this.websiteService.changeSeletUser.subscribe(users => {
        this.selectUser = users
        this.selectedUser = this.currentUser.uid;
      }),
      this.websiteService.error.subscribe(error => this.handleError(error)),
      this.websiteService.success.subscribe(success => this.handleSuccess(success)),
      this.websiteService.isLoading.subscribe(loading => this.isLoading = loading),

    );

    if(localStorage.getItem('websiteFilter')){
      this.filterData = localStorage.getItem('websiteFilter')
    }
  }

  copyToClipboard(text: string): void {
    // navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy:', err));
  }



  onOpenEdit(key: string, index: number): void {

    if (this.role !== 'superuser') {
      alert('Permission denied! Contact the admin.');
      return;
    }
    this.isEdit = true;
    this.editKey = key;
    this.editIndex = index;
    this.editValue = { ...this.websites[key] };

    this.disableScroll();

  }

  onSubmitEdit(form: NgForm): void {
    if (!this.editKey || form.invalid) {
      this.handleError('Invalid input!');
      return;
    }
    this.websiteService.editWebsiteData(form.value, this.editKey, this.websites[this.editKey].createdBy);
    this.isEdit = false;

    this.enableScroll();
  }

  onAddWebsite(): void {
    this.isAdded = !this.isAdded;
    this.disableScroll();
  }

  onSubmitAdded(form: NgForm): void {

    if (form.invalid) {
      this.handleError('Invalid input!');
      return;
    }
    const addedData = {
      name: !form.value.name ? '' : form.value.name ,
      userID: !form.value.userID ? '' : form.value.userID ,
      pass: !form.value.pass ? '' : form.value.pass ,
      url: !form.value.url ? '' : form.value.url ,
      note: !form.value.note ? '' : form.value.note ,
      createdBy: this.currentUser.uid,
      createdAt: new Date().toISOString(),
      editedBy: this.currentUser.uid
    };


    this.websiteService.addWebsiteData(addedData, this.currentUser.uid);
    this.isAdded = false;
    
    this.enableScroll();

  }

  onDeleted(deleteKey: string, createdBy: string): void {

    if (this.role !== 'superuser') {
      alert('Permission denied!');
      return;
    }
    if (confirm('Are you sure you want to delete this item?')) {
      this.websiteService.deleteWebsiteData(deleteKey, createdBy);
    }
  }

  onClose(): void {
    this.editValue = {};
    this.isEdit = false;
    this.isAdded = false;
    this.enableScroll();
  }

  onClear(form: NgForm): void {
    form.reset(); 
  }

  onClearSearch(){
    this.filterData = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  filterDataSave(){
    localStorage.setItem( 'websiteFilter', this.filterData )
  }

  private disableScroll(){
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  private enableScroll(){
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }

  private handleError(error: string): void {
    this.error = error;
    console.log(this.error)
    setTimeout(() => this.error = null, 3000);
  }

  private handleSuccess(success: string): void {
    this.success = success;
    setTimeout(() => this.success = null, 3000);
  }

  ngOnDestroy(): void {
    this.filterData = '';
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}











// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { WebsiteService } from './website.service';
// import { AuthService } from '../auth/auth.service';
// import { NgForm } from '@angular/forms';
// import { WebsiteModel } from './website.model';

// @Component({
//   selector: 'app-website',
//   templateUrl: './website.component.html',
//   styleUrls: ['./website.component.css']
// })
// export class WebsiteComponent implements OnInit, OnDestroy {

//   websites: any = {};
//   currectUser: any = {};
//   error: string = null;
//   success: string = null;
//   isLoading: boolean = false;
//   role: string = 'user';
//   isEdit = false;
//   isAdded = false;
//   editKey: any;
//   editIndex: number;
//   editValue = {};
//   editedBy = '';
//   passwordVisible = false;
//   filterData;


//   private subscription: Subscription[] = [];

//   constructor(private websiteService: WebsiteService, private authService: AuthService) {}

//   ngOnInit(): void {

//     this.websiteService.fetchWebsitesData();
//     this.websiteService.getWebsites();

//     const errorSub = this.websiteService.error.subscribe(error => {
//       console.log(error)
//       this.error = error;
//       setTimeout( () => { this.error = null } ,3000)
//     })

    
//     const changeWeb = this.websiteService.changeWebsite.subscribe(websites => {
//       this.websites = websites;
//     })

//       const cuSub = this.authService.currentUser.subscribe(user => {
//       this.currectUser = user;
//       if(user.type === 'superuser' || 'admin'){
//         this.role = user.type
//       }
//     })

//     const successSub = this.websiteService.success.subscribe(success => {
//       this.success = success;
//       setTimeout( () => { this.success = null } ,3000)
//     })

//     const loadingSub = this.websiteService.isLoading.subscribe(loading => {
//       this.isLoading = loading;
//       console.log(this.isLoading);
//     })

//     this.subscription.push(cuSub,changeWeb, errorSub, successSub, loadingSub)
//   }

//   copyToClipboard(text: string): void {
//     console.log('Copied to clipboard: ' + text);
//     navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy: ', err));
//   }

//   onOpenEdit(key: any, index: number): void {


//     if(this.role === 'superuser'){

//       this.isEdit = true;
//       this.editKey = key;
//       this.editIndex = index;
//       this.editValue = this.websites[key];
//       return  
//     }

//     alert('You are not allowed to edit this data! Please contact the admin.');
    
//   }

//   onAddWebsite(): void {
//     this.isAdded = !this.isAdded;
//   }

//   onSubmitEdit(form: NgForm): void {
//     const formData = form.value;
//     const editKey = this.editKey;
//     const createBy = this.websites[editKey].createdBy;

//     if (form.invalid) {
//       this.error = 'Please enter valid information!';
//       this.errorHandler();
//       return;
//     }

//     this.websiteService.editWebsiteData(formData, editKey, createBy);
//     this.isEdit = false;

//     this.disableScroll();
//   }

//   onSubmitAdded(form: NgForm): void {

//     const addedData = {
//       name: form.value.name, 
//       note: form.value.note, 
//       pass: form.value.pass, url: 
//       form.value.url, userID: 
//       form.value.userID, 
//       createdBy: this.currectUser.uid, 
//       createdAt: Date(),
//       editedBy: this.currectUser.uid
//     }

//     this.websiteService.addWebsiteData(addedData, this.currectUser.uid);
//     this.isAdded = false;
//   }

//   onDeleted(deleteKey: any): void {
//     if(this.role === 'superuser'){
//       if (confirm('Are you sure you want to delete this item?')) {
//         this.websiteService.deleteWebsiteData(deleteKey);
//       }
//       return
//     }

//     alert('You are not allowed to edit this data! Please contact the admin.');
  
//   }

//   onClear(form: NgForm): void {
//     form.reset(); 
//   }

//   onClearSearch(){
//     this.filterData = '';
//   }

//   onClose(): void {
//     this.editValue = {};
//     this.isEdit = false;
//     this.isAdded = false;
//     this.enableScroll();
//   }

//   togglePasswordVisibility(): void {
//     this.passwordVisible = !this.passwordVisible;
//   }

//   private disableScroll(){
//     document.body.style.overflow = 'hidden';
//     document.documentElement.style.overflow = 'hidden';
//   }

//   private enableScroll(){
//     document.body.style.overflow = 'auto';
//     document.documentElement.style.overflow = 'auto';
//   }

//   private errorHandler(): void {
//     setTimeout(() => {
//       this.error = null;
//     }, 2000);
//   }

//   ngOnDestroy(): void {
//     this.subscription.forEach(sub => sub.unsubscribe())
//   }
// }


import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsiteService } from './website.service';
import { delay, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';


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
  isLoading = true;
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

ngOnInit(){

  const loadSub = this.websiteService.isLoading.pipe(delay(500)).subscribe(isloading => {
    this.isLoading = isloading;
  });


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
      loadSub
    );

  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy:', err));
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
  
  // websites: any = {};
  // isLoading: boolean = true;


  // subscription: Subscription[] = [];
  
  // constructor(private websiteService: WebsiteService){}
  
  // ngOnInit(): void {

  //   this.websiteService.isLoading.pipe(delay(500)).subscribe(isLoading => {
  //     this.isLoading = isLoading;
  //     console.log(isLoading)
  //   })
  //   this.websiteService.fetchWebsitesData();

  //   this.websiteService.changeWebsite.subscribe(data => {
  //     this.websites = data;
  //   })
  //   this.websites = this.websiteService.getWebsites();
    
  // }

  // ngOnDestroy(): void {
    
  // }
}




//   websites: Record<string, any> = {};
//   selectUser: Record<string, any> = {};
//   currentUser: any = {};
//   error: string | null = null;
//   success: string | null = null;
//   isLoading = true;
//   role: string = 'user';
//   isEdit = false;
//   isAdded = false;
//   editKey: string | null = null;
//   editIndex: number | null = null;
//   editValue: any = {};
//   passwordVisible = false;
//   filterData: string = '';
//   selectedUser: string = '';

//   private subscriptions: Subscription[] = [];

//   constructor(private websiteService: WebsiteService, private authService: AuthService) {}

// ngOnInit(){

//   this.websiteService.isLoading.subscribe(islaoding => this.isLoading =  islaoding)

//     this.websiteService.fetchWebsitesData();


//     this.subscriptions.push(
//       this.websiteService.changeWebsite.subscribe(websites => this.websites = websites),

      
//       this.authService.currentUser.subscribe(user => {
//         this.currentUser = user;
//         if (user.type === 'superuser' || user.type === 'admin') {
//           this.role = user.type;
//           return
//         }

//         this.role = 'user';
//       }),
      
//       this.websiteService.changeSeletUser.subscribe(users => {
//         this.selectUser = users
//         this.selectedUser = this.currentUser.uid;
//       }),
//       this.websiteService.error.subscribe(error => this.handleError(error)),
//       this.websiteService.success.subscribe(success => this.handleSuccess(success)),
//     );

//   }

//   copyToClipboard(text: string): void {
//     navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy:', err));
//   }



//   onOpenEdit(key: string, index: number): void {

//     if (this.role !== 'superuser') {
//       alert('Permission denied! Contact the admin.');
//       return;
//     }
//     this.isEdit = true;
//     this.editKey = key;
//     this.editIndex = index;
//     this.editValue = { ...this.websites[key] };

//     this.disableScroll();

//   }

//   onSubmitEdit(form: NgForm): void {
//     if (!this.editKey || form.invalid) {
//       this.handleError('Invalid input!');
//       return;
//     }
//     this.websiteService.editWebsiteData(form.value, this.editKey, this.websites[this.editKey].createdBy);
//     this.isEdit = false;

//     this.enableScroll();
//   }

//   onAddWebsite(): void {
//     this.isAdded = !this.isAdded;
//     this.disableScroll();
//   }

//   onSubmitAdded(form: NgForm): void {

//     if (form.invalid) {
//       this.handleError('Invalid input!');
//       return;
//     }
//     const addedData = {
//       name: !form.value.name ? '' : form.value.name ,
//       userID: !form.value.userID ? '' : form.value.userID ,
//       pass: !form.value.pass ? '' : form.value.pass ,
//       url: !form.value.url ? '' : form.value.url ,
//       note: !form.value.note ? '' : form.value.note ,
//       createdBy: this.currentUser.uid,
//       createdAt: new Date().toISOString(),
//       editedBy: this.currentUser.uid
//     };


//     this.websiteService.addWebsiteData(addedData, this.currentUser.uid);
//     this.isAdded = false;
    
//     this.enableScroll();

//   }

//   onDeleted(deleteKey: string, createdBy: string): void {

//     if (this.role !== 'superuser') {
//       alert('Permission denied!');
//       return;
//     }
//     if (confirm('Are you sure you want to delete this item?')) {
//       this.websiteService.deleteWebsiteData(deleteKey, createdBy);
//     }
//   }

//   onClose(): void {
//     this.editValue = {};
//     this.isEdit = false;
//     this.isAdded = false;
//     this.enableScroll();
//   }

//   onClear(form: NgForm): void {
//     form.reset(); 
//   }

//   onClearSearch(){
//     this.filterData = '';
//   }

//   togglePasswordVisibility(): void {
//     this.passwordVisible = !this.passwordVisible;
//   }

//   filterDataSave(){
//     localStorage.setItem( 'websiteFilter', this.filterData )
//   }

//   private disableScroll(){
//     document.body.style.overflow = 'hidden';
//     document.documentElement.style.overflow = 'hidden';
//   }

//   private enableScroll(){
//     document.body.style.overflow = 'auto';
//     document.documentElement.style.overflow = 'auto';
//   }

//   private handleError(error: string): void {
//     this.error = error;
//     console.log(this.error)
//     setTimeout(() => this.error = null, 3000);
//   }

//   private handleSuccess(success: string): void {
//     this.success = success;
//     setTimeout(() => this.success = null, 3000);
//   }

//   ngOnDestroy(): void {
//     this.filterData = '';
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//   }
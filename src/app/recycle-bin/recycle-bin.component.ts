import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecycelBinService } from './recycle-bin.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrl: './recycle-bin.component.css'
})
export class RecycleBinComponent {
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

  constructor(private recycleBinService: RecycelBinService, private authService: AuthService) {}

  ngOnInit(): void {
    this.recycleBinService.fetchWebsitesData();

    this.subscriptions.push(
      this.recycleBinService.changeWebsite.subscribe(websites => this.websites = websites),

      
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        if (user.type === 'superuser' || user.type === 'admin') {
          this.role = user.type;
          return
        }

        this.role = 'user';
      }),
      
      this.recycleBinService.changeSeletUser.subscribe(users => {
        this.selectUser = users
        this.selectedUser = this.currentUser.uid;
      }),
      this.recycleBinService.error.subscribe(error => this.handleError(error)),
      this.recycleBinService.success.subscribe(success => this.handleSuccess(success)),
      this.recycleBinService.isLoading.subscribe(loading => this.isLoading = loading),

    );

    if(localStorage.getItem('websiteFilter')){
      this.filterData = localStorage.getItem('websiteFilter')
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy:', err));
  }


  onDeleted(deleteKey: string, createdBy: string): void {

    if (this.role !== 'superuser') {
      alert('Permission denied!');
      return;
    }
    if (confirm('Are you sure you want to delete this item?')) {
      this.recycleBinService.deleteWebsiteData(deleteKey, createdBy);
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

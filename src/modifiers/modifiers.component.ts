import { Component } from '@angular/core';
import { ModifierService } from './modifier.service';
import { ModifierModel } from './modifier.model';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { AdminCService } from '../admin/admin-c.service';

@Component({
  selector: 'app-modifiers',
  templateUrl: './modifiers.component.html',
  styleUrl: './modifiers.component.css'
})
export class ModifiersComponent {
  
  modifiers: any[] = [];
  isAdmin: boolean = false;
  superUser: boolean = false;
  isAdded: boolean = false;
  isEdit: boolean = false;
  editKey: number;
  editIndex: number;
  editValue: {};

  private adminSub: Subscription;
  private adminSub2: Subscription;
  filterData: string;

  constructor(private modifierService: ModifierService, private adminService: AdminCService){}

  ngOnInit(){
    this.adminSub = this.adminService.isAdmin.subscribe(data => this.isAdmin = data);
    this.adminSub2 = this.adminService.userSuper.subscribe(data => this.superUser = data);
    this.modifierService.fetchModifers();
    this.modifiers = this.modifierService.getModifiers();
    this.modifierService.changedModifiers.subscribe( data => this.modifiers = data);
  }

  onAddModifier(){
    this.disableScroll()
    this.isAdded = !this.isAdded;
  }

  copyToClipboard(text: string): void { 
    console.log('Copid to clipboard!: '+ text);
    navigator.clipboard.writeText(text);
    
  }

  onClose(){
    this.editValue = {};
    this.isEdit = false;
    this.isAdded = false;
    this.enableScroll()
  }

  onOpenEdit(key: any, i: number){

    if(this.isAdmin){
      this.disableScroll()
      this.isEdit = true;
      this.editKey = key;
      this.editIndex = i;
      this.editValue = this.modifiers[i][key];
      return;
    }

    alert('You are not allowed to edit this data! Please contact the admin.');
    
  }

  onSubmitAddedModifier(data: NgForm){
    this.modifierService.onAddedModifier(data.value);
    data.reset();
    this.onClose();
  }

    onSubmitEdit(form: NgForm){
      this.modifierService.editModifier(form.value, this.editKey)
      this.isEdit = false
      this.enableScroll()
    }

    onDeleted(deleteKey: any){
      if(this.isAdmin){
        if(confirm('Are you sure you want to delete!')){
          this.modifierService.deleteModifierData(deleteKey);
        }
        return
      }
  
      alert('You are not allowed to edit this data! Please contact the admin.');
      
    }

    onClearSearch(){
      this.filterData = '';
    }


  private disableScroll() {
    document.body.style.overflow = 'hidden'; // Hide scroll on the body
    document.documentElement.style.overflow = 'hidden'; // Hide scroll on the html
  }

  private enableScroll() {
    document.body.style.overflow = 'auto'; // Restore scroll on the body
    document.documentElement.style.overflow = 'auto'; // Restore scroll on the html   
  }

  ngDestory(){
    this.adminSub.unsubscribe();
    this.adminSub2.unsubscribe();
  }
}


import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminCService } from './admin-c.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
    users: any[] = [];
    isAdmin: boolean = false;
    superUser: boolean = false;
    editState = {
        isEdit: false,
        editKey: null,
        editIndex: -1,
        editValue: null
    };

    private subscriptions: Subscription[] = [];

    constructor(private adminCService: AdminCService, private authService: AuthService) {}

    ngOnInit(): void {

        this.subscriptions.push(
            this.adminCService.changedUser.subscribe(users => {
                this.users = users;
            }),

            this.authService.currentUser.subscribe((isAdmin) => {
                // console.log(isAdmin)
                if(isAdmin?.type === 'superuser'){
                  
                  this.superUser = true;
                  this.isAdmin = true;
                  return
                }else if (isAdmin?.type === 'admin'){
                  this.isAdmin = true;
                  return
                }
        
                this.isAdmin = false
              })
        );

        this.adminCService.fetchData();
    }

    onOpenEdit(key: string, index: number): void {
        if (!this.isAdmin && !this.superUser) {
            alert('You are not authorized to edit this data.');
            return;
        }

        this.editState = {
            isEdit: true,
            editKey: key,
            editIndex: index,
            editValue: { ...this.users[index] }
        };
    }

    onSubmitEdit(): void {
        if (!this.editState.editKey || !this.editState.editValue) return;

        this.adminCService.editUserData(this.editState.editValue, this.editState.editKey);
        this.resetEditState();
    }

    onCloseEdit(): void {
        this.resetEditState();
    }

    onDelete(key: string): void {
        if (confirm('Are you sure you want to delete this user?')) {
            this.adminCService.deleteUser(key);
        }
    }

    private resetEditState(): void {
        this.editState = {
            isEdit: false,
            editKey: null,
            editIndex: -1,
            editValue: null
        };
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
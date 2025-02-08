import { Component } from "@angular/core";
import { WebsiteService } from "../../website/website.service";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-notepopup',
    standalone: false,
    templateUrl: './notepopup.component.html',
    styleUrls: ['./notepopup.component.css']
})

export class NotePopupComponent {

    isVisible: boolean = false;
    webNote: string = 'No data found!';
    isEdit = false;
    isAdmin = false;
    editKey: string; 
    createdBy: string; 
    editType: string


    constructor(
        private websiteService: WebsiteService, 
        private authService: AuthService, 
    ){}

    ngOnInit(){
        this.authService.currentUser.subscribe(role => {
            if(role.type === 'superuser' || role.type === 'admin'){
                this.isAdmin = true;
                return
            }
            this.isAdmin = false;
        })
    }

    openNote(note: string, createdBy: string,  editKey: string, type: string) {

        
        console.log(note, createdBy, editKey, type)
        
        this.isVisible = true;
        this.webNote = note || 'No data found!';
        this.editKey = editKey;
        this.createdBy = createdBy;
        this.editType = type;
        
        this.disableScroll();
    }

    closeNote() {
        this.isVisible = false;
        this.enableScroll();
    }

    onEdit(){
        if(this.isAdmin){
            this.isEdit = true;
            return
        }
        alert('You are not allowed to edit this data! Please contact the admin.');

    }

    onEditClosed(){

        this.isEdit = false
    }

    onSave(){
        if(this.editType === 'website'){
            this.websiteService.editNote(this.editKey, this.createdBy, this.webNote);
        }


        this.enableScroll()
    }

    private disableScroll() {
        document.body.style.overflow = 'hidden'; // Hide scroll on the body
        document.documentElement.style.overflow = 'hidden'; // Hide scroll on the html

        // this.previousScrollPosition = window.scrollY;    
    }

    private enableScroll() {
        document.body.style.overflow = 'auto'; // Restore scroll on the body
        document.documentElement.style.overflow = 'auto'; // Restore scroll on the html
        
    }
}
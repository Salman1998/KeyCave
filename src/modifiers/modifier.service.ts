import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({providedIn: 'root'})

export class ModifierService {

    changedModifiers = new Subject<any[]>();
    private modifiers: any[] = [];
    isLoading = new Subject<boolean>();

    constructor(private db: AngularFireDatabase){}

    fetchModifers(){
        this.db.object('modifiers').valueChanges().subscribe( (data) => {
            const covertedData = Object.keys(data).map( key => ({[key]: data[key]}));
            this.setModfiers(covertedData)
        })
    }

    setModfiers(modifiers){
        this.modifiers = modifiers;
        this.changedModifiers.next([...this.modifiers]);
    }

    getModifiers(){
        console.log(this.modifiers)
        return [...this.modifiers];  
    }

    onAddedModifier(data){
        this.db.list(`modifiers`).push(data);
    }

    editModifier( editData, editKey){
        this.isLoading.next(true);
        this.db.object(`modifiers/${editKey}`).update(editData)
        .then(() => console.log('Datza updated successfully!'))
        .catch(error => console.error('Error updating data:', error));
        this.isLoading.next(false);
    }

    editNote(Note: string, editKey: string){
        this.isLoading.next(true);
        this.db.object(`modifiers/${editKey}`).update({note: Note})
        .then(() => console.log('Data updated successfully!'))
        .catch(error => console.error('Error updating data:', error));
        this.isLoading.next(false);
      }

      deleteModifierData(deleteKey){
        this.isLoading.next(true);
        this.db.object(`modifiers/${deleteKey}`).remove().then(() => {
          alert('The website is deleted!');
        }).catch(error => {
          console.log(error)
        })
        this.isLoading.next(false);
      }
}
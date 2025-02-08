import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { map, take, switchMap } from "rxjs/operators";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({ providedIn: 'root' })

export class AdminPenalService implements OnDestroy {
    private role: string = '';
    private subs: Subscription[] = [];
    roleSubject = new Subject<string>();
    accessControl = new BehaviorSubject<string[]>([]);

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.initializeRole();
    }

    private async initializeRole(): Promise<void> {
        await this.afAuth.authState.pipe(
            switchMap(user => user ? this.db.object<string>(`users/${user.uid}/type`).valueChanges() : [])
        ).subscribe(role => {
            if (role) {
                this.setRole(role);
            }
        });
    }

    async setRole(role: string): Promise<void> {
        this.role = role;
        await this.roleSubject.next(role);
        console.log('Role set to:', this.role);
    }

    getRole(): string {
        return this.role;
    }

    changeAccess(page: string, roles: string[]): void {

        this.db.object(`accessControls/${page}`).set(roles).then(() => {
            console.log(`Access controls updated for ${page}`);
        });
    }

    getAccessControls(): void {
        this.db.object<{ [key: string]: string[] }>(`accessControls`).valueChanges()
            .pipe(take(1))
            .subscribe(data => {
                const accessControls = data ? Object.keys(data) : [];
                this.accessControl.next(accessControls);
            });
    }

    canAccess(page: string): Observable<boolean> {
        this.initializeRole();
        console.log(this.role)
        return this.db.object<{ [key: string]: string[] }>('accessControls').valueChanges().pipe(
            take(1),
            map(data => {
                if (!data) return false;
                const allowedRoles = data[page] || [];
                return allowedRoles.includes(this.role);
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  standalone: false
})

export class NavComponent implements OnInit, OnDestroy {

  isAuth: boolean = false;

  private subcription: Subscription[] = [];


  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(){
    this.subcription.push(
      this.authService.isAuthenticated.subscribe(authResp => this.isAuth = authResp.isAuth)
    )
  }

// -----------------------------------Start defual nav logic----------------------------------------------
dropdownOpen = false;

  toggleNavbar() {
    const navbarLinks = document.querySelector('.navbar-links');
    const authButtons = document.querySelector('.auth-buttons');
    if (navbarLinks) {
      navbarLinks.classList.toggle('active');
      authButtons.classList.toggle('active');
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])

  handleClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const dropdownElement = document.querySelector('.dropdown-content');
    const dropdownButton = document.querySelector('.dropbtn');
    if (dropdownElement && !dropdownElement.contains(targetElement) && !dropdownButton.contains(targetElement)) {
      this.dropdownOpen = false;
    }
  }
  // -----------------------------------End defual nav logic----------------------------------------------
  
  // routerLink(page){
  //   console.log('click')
  //   this.router.navigate(['/website'])
  // }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subcription.forEach(sub => sub.unsubscribe())
  }
}
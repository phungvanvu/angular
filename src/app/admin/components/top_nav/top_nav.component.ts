import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top_nav.component.html',
  styleUrls: ['./top_nav.component.css'],
})
export class TopNavComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  showMenu: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || 'User';
        this.userEmail = payload.sub || '';
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown') && this.showMenu) {
      this.showMenu = false;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}

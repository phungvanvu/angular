import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isProductsOpen = false;
  isSalesOpen = false;
  isUsersOpen = false;

  toggleMenu(menu: 'products' | 'sales' | 'users') {
    this.isProductsOpen =
      menu === 'products' ? !this.isProductsOpen : this.isProductsOpen;
    this.isSalesOpen = menu === 'sales' ? !this.isSalesOpen : this.isSalesOpen;
    this.isUsersOpen = menu === 'users' ? !this.isUsersOpen : this.isUsersOpen;
  }

  toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
  }
}

import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from '../top_nav/top_nav.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet,TopNavComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],  
})
export class LayoutComponent {}

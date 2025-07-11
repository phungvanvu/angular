import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [MatIconModule, RouterOutlet],
})
export class LoginComponent {
  constructor(private router: Router) {}

  signIn() {
   this.router.navigate(['/app-layout/dashboard']);
  }
}

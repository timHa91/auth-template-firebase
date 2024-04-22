import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { LoginService } from '../auth/services/login.service';
import { RegisterService } from '../auth/services/register.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authService = inject(AuthService);
  loginService = inject(LoginService);
  registerService = inject(RegisterService);
}

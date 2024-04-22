import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Credentials } from '../../../shared/interfaces/credentials';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginService = inject(LoginService);
  router = inject(Router);

  loginForm!: FormGroup;
  _error: string | null = null;

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
    this.subscribeToError();
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  private subscribeToError() {
    this.loginService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this._error = error;
      });
  }

  private resetForm() {
    this.loginForm.reset();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials: Credentials = {
        email: this.loginForm.value['email'],
        password: this.loginForm.value['password'],
      };
      this.loginService.login$.next(credentials);
      this.resetForm();
      this.router.navigate(['']);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

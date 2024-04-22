import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RegisterService } from '../../services/register.service';
import { Credentials } from '../../../shared/interfaces/credentials';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  _error: string | null = null;
  registerService = inject(RegisterService);
  router = inject(Router);

  errorSubscription!: Subscription;

  ngOnInit(): void {
    this.initForm();
    this.subscribeToError();
  }

  private initForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  private subscribeToError() {
    this.errorSubscription = this.registerService.error$.subscribe((error) => {
      this._error = error;
    });
  }

  private resetForm() {
    this.registerForm.reset();
  }

  onRegister() {
    if (this.registerForm.valid) {
      const credentials: Credentials = {
        email: this.registerForm.value['email'],
        password: this.registerForm.value['password'],
      };
      this.registerService.createUser$.next(credentials);
      this.resetForm();
      this.router.navigate(['']);
    }
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}

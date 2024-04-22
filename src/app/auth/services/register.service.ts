import { EMPTY, Subject, catchError, switchMap } from 'rxjs';
import { Credentials } from '../../shared/interfaces/credentials';
import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';
export interface RegisterState {
  status: RegisterStatus;
}

@Injectable({ providedIn: 'root' })
export class RegisterService {
  authService = inject(AuthService);

  // sources
  error$ = new Subject<any>();
  createUser$ = new Subject<Credentials>();
  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((error) => {
          this.error$.next(error);
          return EMPTY;
        })
      )
    )
  );

  // state
  private state = signal<RegisterState>({
    status: 'pending',
  });

  // selector
  status = computed(() => this.state().status);

  constructor() {
    this.error$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({ ...state, status: 'error' }));
    });

    this.createUser$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({
        ...state,
        status: 'creating',
      }));
    });

    this.userCreated$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({
        ...state,
        status: 'success',
      }));
    });
  }
}

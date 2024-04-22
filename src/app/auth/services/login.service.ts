import { Injectable, OnInit, computed, inject, signal } from '@angular/core';
import { EMPTY, Subject, catchError, switchMap, take } from 'rxjs';
import { Credentials } from '../../shared/interfaces/credentials';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

export interface LoginState {
  status: LoginStatus;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  authService = inject(AuthService);

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();
  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((error) => {
          this.error$.next(error);
          return EMPTY;
        })
      )
    )
  );

  // state
  private state = signal<LoginState>({
    status: 'pending',
  });

  // selector
  status = computed(() => this.state().status);

  constructor() {
    this.error$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({
        ...state,
        status: 'error',
      }));
    });

    this.login$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({
        ...state,
        status: 'authenticating',
      }));
    });

    this.userAuthenticated$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.state.update((state) => ({
        ...state,
        status: 'success',
      }));
    });
  }
}

import { Injectable, computed, inject, signal } from '@angular/core';
import { AUTH } from '../../app.config';
import { authState } from 'rxfire/auth';
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, from } from 'rxjs';
import { Credentials } from '../../shared/interfaces/credentials';

export type AuthUser = User | null | undefined;

export interface AuthState {
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Get Auth Instance from Firebase
  private auth = inject(AUTH);

  // sources
  private user$: Observable<User | null> = authState(this.auth);

  // state
  private state = signal<AuthState>({
    user: undefined,
  });

  // selector
  user = computed(() => this.state().user);

  constructor() {
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      this.state.update((state) => ({ ...state, user }));
    });
  }

  login(credentials: Credentials): Observable<UserCredential> {
    // Casting Firebase Promise into Observable
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      )
    );
  }

  logout() {
    signOut(this.auth);
  }

  createAccount(credentials: Credentials): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      )
    );
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    if (this.authService.isAuthenticated()) {
      void this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  async signInWithKeycloak(): Promise<void> {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.authService.redirectToLogin();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.errorMessage.set(`Cannot open Keycloak login: ${message}`);
      this.isSubmitting.set(false);
    }
  }
}

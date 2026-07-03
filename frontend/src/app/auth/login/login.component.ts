import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    if (await this.authService.ensureSession()) {
      await this.router.navigate(['/'], { replaceUrl: true });
    }
  }

  signInWithKeycloak(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.authService.redirectToLogin();
  }
}

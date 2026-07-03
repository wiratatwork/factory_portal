import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const ok = await this.authService.completeLoginFromCallback(window.location.search);
    if (ok) {
      await this.router.navigate(['/'], { replaceUrl: true });
      return;
    }
    this.errorMessage.set('Login callback failed. Please sign in again.');
    await this.router.navigate(['/login'], { replaceUrl: true });
  }
}

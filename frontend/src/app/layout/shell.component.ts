import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    void this.enforceAuth();
  }

  @HostListener('window:pageshow')
  onPageShow(): void {
    // pageshow also fires when browser restores this page from bfcache.
    void this.enforceAuth();
  }

  signOut(): void {
    this.authService.logout();
  }

  private async enforceAuth(): Promise<void> {
    if (this.authService.isAuthenticated()) return;
    if (await this.authService.refreshSession()) return;
    await this.router.navigate(['/login'], { replaceUrl: true });
  }
}

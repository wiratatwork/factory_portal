import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    void this.enforceAuth();
  }

  @HostListener('window:pageshow')
  onPageShow(): void {
    void this.enforceAuth();
  }

  signOut(): void {
    this.authService.logout();
  }

  private async enforceAuth(): Promise<void> {
    if (await this.authService.ensureSession()) return;
    await this.router.navigate(['/login'], { replaceUrl: true });
  }
}

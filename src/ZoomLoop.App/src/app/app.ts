import { Component, signal, viewChild } from '@angular/core';
import { Footer, Navbar, Button } from './components';
import { RouterOutlet } from '@angular/router';
import { LoginDialog } from './dialogs';
import { AuthService } from './core/auth.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zl-root',
  imports: [
    Navbar,
    Footer,
    RouterOutlet,
    LoginDialog,
    Button,
    CommonModule
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly _authService = inject(AuthService);
  protected readonly loginDialog = viewChild(LoginDialog);

  protected openLoginDialog() {
    const dialog = this.loginDialog();
    if (dialog) {
      dialog.open();
    }
  }
}

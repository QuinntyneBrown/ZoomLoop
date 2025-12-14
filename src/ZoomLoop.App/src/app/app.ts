import { Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Footer, Navbar } from './components';
import { RouterOutlet } from '@angular/router';
import { LoginDialog } from './dialogs';
import { AuthService } from './core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zl-root',
  imports: [
    Navbar,
    Footer,
    RouterOutlet,
    CommonModule
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly _authService = inject(AuthService);
  private readonly _dialog = inject(Dialog);

  protected openLoginDialog() {
    this._dialog.open(LoginDialog, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'cdk-overlay-pane'
    });
  }
}

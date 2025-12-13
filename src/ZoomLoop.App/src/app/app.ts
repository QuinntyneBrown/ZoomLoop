import { Component, signal } from '@angular/core';
import { FooterComponent, NavbarComponent } from './components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'zl-root',
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterOutlet
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}

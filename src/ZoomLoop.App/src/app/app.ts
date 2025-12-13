import { Component, signal } from '@angular/core';
import { FooterComponent, NavbarComponent } from './components';

@Component({
  selector: 'zl-root',
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}

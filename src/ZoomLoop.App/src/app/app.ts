import { Component, signal } from '@angular/core';
import { Footer, Navbar } from './components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'zl-root',
  imports: [
    Navbar,
    Footer,
    RouterOutlet
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}

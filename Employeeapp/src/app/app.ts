import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyToolBar } from './components/my-tool-bar/my-tool-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyToolBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Employeeapp');
}

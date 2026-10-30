import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
  imports: [MatToolbarModule],
  selector: 'app-my-tool-bar',
  styleUrl: './my-tool-bar.scss',
  templateUrl: './my-tool-bar.html',
})
export class MyToolBar {}

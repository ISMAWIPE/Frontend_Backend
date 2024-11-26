import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-api',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './my-api.component.html',
  styleUrl: './my-api.component.css',
})
export class MyApiComponent {}

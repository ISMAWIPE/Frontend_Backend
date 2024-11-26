import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g>
          <circle stroke-linecap="round" fill="none" stroke-dasharray="50.26548245743669 50.26548245743669" 
                  stroke="#5b7be1" stroke-width="8" r="32" cy="50" cx="50">
            <animateTransform values="0 50 50;360 50 50" keyTimes="0;1" repeatCount="indefinite" 
                            dur="1s" type="rotate" attributeName="transform">
            </animateTransform>
          </circle>
          <circle stroke-linecap="round" fill="none" stroke-dashoffset="36.12831551628262" 
                  stroke-dasharray="36.12831551628262 36.12831551628262" stroke="#f86a6a" 
                  stroke-width="8" r="23" cy="50" cx="50">
            <animateTransform values="0 50 50;-360 50 50" keyTimes="0;1" repeatCount="indefinite" 
                            dur="1s" type="rotate" attributeName="transform">
            </animateTransform>
          </circle>
        </g>
      </svg>
    </div>
  `,
  styles: [`
    .spinner-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 1;
    }

    svg {
      width: 60px;
      height: 60px;
    }
  `]
})
export class LoadingSpinnerComponent {}
import { Component } from '@angular/core';

interface MenuItem {
  text: string;
  url: string;
  icon?: string;
  target?: string;
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  Menu: Array<MenuItem> = [
    { text: 'AI Adventures', url: '' },
  ];

  mobileScreen: boolean;

  constructor() {
    this.mobileScreen = window.innerWidth <= 390 || window.innerHeight <= 669;
    window.addEventListener('resize', () => {
      this.mobileScreen = window.innerWidth <= 390 || window.innerHeight <= 669;
    });
  }
}

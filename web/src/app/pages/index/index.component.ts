import { Component } from '@angular/core';

interface OutputItem {
  text: string;
  image: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  output_list: Array<OutputItem> = [];
  loading: boolean = false;

  constructor() {
    let x= this
    setInterval(function(){x.output_list.push({text:"troll","image":"https://placehold.co/256"})}, 10000)
  }
}
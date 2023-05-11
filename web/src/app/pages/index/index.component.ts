import { Component } from '@angular/core';

interface Message {
  role: string;
  content: string;
}

interface OutputItem {
  message: Message;
  image: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  loading: boolean = false;

  output_list: OutputItem[] = [];
  messages: Message[] = [
    {
      role: "system",
      content: "You are the author in a creative story-telling experience. Offer the user a set of numbered choices after each turn. Use imagery to depict the scenes."
    }
  ];

  onEnterKey() {
    this.loading = true;
    const messages: Message[] = this.output_list.map(outputItem => {
      return outputItem.message;
    });

    //this.loading = false;
  }
}

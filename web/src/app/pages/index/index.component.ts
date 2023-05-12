import { Component } from '@angular/core';
import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  organization: "org-YFfyErm4NuAqFGTRJGV7BI5R",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

interface OutputItem {
  message: {},
  image?: string,
}

const starting_messages = [
  {
    role: "system",
    content: "You are the author in a creative story-telling experience. Offer the user a set of numbered choices after each turn. Use imagery to depict the scenes."},
    {
      role: "assistant",
      content: "You are the author in a creative story-telling experience. Offer the user a set of numbered choices after each turn. Use imagery to depict the scenes."},
]

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  loading: boolean = false;

  output: OutputItem[] = [
    {
      message: starting_message,
    }
  ];

  messages: {} = {starting_message};

  async onEnterKey() {
    this.loading = true;

    this.loading = false;
  }
}

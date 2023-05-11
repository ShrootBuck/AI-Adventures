import { Component } from '@angular/core';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

interface Message {
  role: string;
  content: string;
}

const starting_message: Message = {
  role: "system",
  content: "You are the author in a creative story-telling experience. Offer the user a set of numbered choices after each turn. Use imagery to depict the scenes."
}

interface OutputItem {
  message: Message;
  image?: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  loading: boolean = false;

  output_list: OutputItem[] = [
    {
      message: starting_message
    }
  ];

  async onEnterKey() {
    this.loading = true;

    const configuration = new Configuration({
      organization: "org-YFfyErm4NuAqFGTRJGV7BI5R",
      apiKey: "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",
    });
    
    const openai = new OpenAIApi(configuration);

    const messages = this.output_list.map(output_item => {
      return {
        role: output_item.message.role,
        text: output_item.message.content
      };
    });

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages, // Convert to a ChatCompletionRequestMessage[]
    });

    //this.loading = false;
  }
}

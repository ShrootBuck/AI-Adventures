import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Message {
  role: string;
  content: string;
}

interface OutputItem {
  message: Message;
  image?: string;
}

interface OpenAIChatResponse {
  id: string;
  object: string;
  created: Number;
  choices: [
    {
      index: Number;
      message: Message;
      finish_reason: string;
    }
  ];
  usage: {
    prompt_tokens: Number;
    completion_tokens: Number;
    total_tokens: Number;
  };
}

interface OpenAIImageResponse {
  created: Number;
  data: [
    {
      url: string;
    }
  ];
}

const story_starters: string[] = [
  "You have been locked in a cold room in an unfamiliar house. Before we begin, what's your name?",
  "You wake up on the ground in an abandoned warehouse. Before we begin, what's your name?",
];

const system_message = {
  role: 'system',
  content:
    'You are the author in a creative story-telling experience. Offer the user enumerated options after each turn. Use imagery to depict the scenes.',
};

const starting_message = {
  role: 'assistant',
  content: story_starters[Math.floor(Math.random() * story_starters.length)],
};

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  loading: boolean = false;
  key_entered: boolean = false;

  output: OutputItem[] = [{ message: starting_message }];
  messages: Message[] = [system_message, starting_message];

  textbox: string = '';
  keybox: string = ''

  http_options = {
    headers: new HttpHeaders({
      Authorization: 'Bearer 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',
    }),
  };

  async onEnterKey() {
    this.loading = true;

    if (!this.key_entered) {
      api
    }

    this.messages.push({ role: 'user', content: this.textbox });

    const message_context = {
      model: 'gpt-3.5-turbo',
      messages: this.messages,
    };

    this.http
      .post<OpenAIChatResponse>(
        'https://api.openai.com/v1/chat/completions',
        message_context,
        http_options
      )
      .subscribe((data) => {
        this.messages.push(data.choices[0].message);

        const visual_message_context = {
          model: 'gpt-3.5-turbo',
          messages: this.messages.concat({
            role: 'user',
            content: 'Reply with a visual description of the current scene.',
          }),
        };

        this.http
          .post<OpenAIChatResponse>(
            'https://api.openai.com/v1/chat/completions',
            visual_message_context,
            http_options
          )
          .subscribe((data) => {
            this.http
              .post<OpenAIImageResponse>(
                'https://api.openai.com/v1/images/generations',
                { prompt: data.choices[0].message.content, size: '512x512' },
                http_options
              )
              .subscribe((data) => {
                this.output.push({
                  message: this.messages[this.messages.length - 1],
                  image: data.data[0].url,
                });

                this.loading = false;
                this.textbox = '';
              });
          });
      });
  }

  constructor(private http: HttpClient) {}
}

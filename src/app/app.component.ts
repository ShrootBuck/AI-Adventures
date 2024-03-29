import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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
  'You wake up in a cold room in an unfamiliar house.',
  'You wake up on the ground in an abandoned building.',
  'You wake up on the ground in an abandoned government building.',
  'You wake up in a private jet, with both pilots missing.',
  'You wake up on a private island, with nobody in sight.',
];

const system_message = {
  role: 'system',
  content:
    'You are the author in a creative story-telling experience. Offer the user enumerated options after each turn. Use imagery to depict the scenes.',
};

const starting_message = {
  role: 'assistant',
  content:
    story_starters[Math.floor(Math.random() * story_starters.length)] +
    " Before we begin, what's your name?",
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loading: boolean = false;
  key_entered: boolean = false;

  output: OutputItem[] = [{ message: starting_message }];
  messages: Message[] = [system_message, starting_message];

  textbox: string = '';
  keybox: string = '';
  api_key: string = '';

  async onEnterKey() {
    this.loading = true;

    const http_options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.keybox}`,
      }),
    };

    if (!this.key_entered) {
      this.http.get('https://api.openai.com/v1/models', http_options).subscribe(
        (data) => {
          this.api_key = this.keybox;
          this.loading = false;
          this.key_entered = true;
        },
        (error) => {
          // Display error snackbar
          this.snackBar.open('Please enter a valid API key.', 'Dismiss', {
            duration: 3000,
          });
          this.loading = false;
        }
      );

      return;
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
            role: 'system',
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

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/github.svg')
    );
  }
}

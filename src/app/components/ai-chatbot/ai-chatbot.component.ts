import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AiService, ChatMessage } from '../../services/ai.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-chatbot',
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.css']
})
export class AiChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  isOpen = false;
  isTyping = false;
  currentMessage = '';
  chatHistory: ChatMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.aiService.chatHistory$.subscribe(messages => {
        this.chatHistory = messages;
        this.scrollToBottom();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 100);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.currentMessage.trim()) return;

    this.isTyping = true;
    await this.aiService.sendMessage(this.currentMessage.trim());
    this.currentMessage = '';
    this.isTyping = false;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.aiService.clearChat();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  formatMessage(message: ChatMessage): string {
    return message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                         .replace(/\n/g, '<br>');
  }

  getMessageTypeClass(message: ChatMessage): string {
    if (message.isUser) return 'user-message';
    if (message.type === 'error') return 'error-message';
    if (message.type === 'project_recommendation') return 'recommendation-message';
    if (message.type === 'skill_analysis') return 'analysis-message';
    return 'ai-message';
  }
}

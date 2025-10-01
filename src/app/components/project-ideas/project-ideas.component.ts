import { Component } from '@angular/core';
import { AiService, ProjectRecommendation } from '../../services/ai.service';

@Component({
  selector: 'app-project-ideas',
  templateUrl: './project-ideas.component.html',
  styleUrls: ['./project-ideas.component.css']
})
export class ProjectIdeasComponent {
  interestInput: string = '';
  ideas: ProjectRecommendation[] = [];
  isLoading: boolean = false;

  constructor(private aiService: AiService) {}

  generateIdeas(): void {
    const kw = (this.interestInput || '').toLowerCase().split(/[^a-z0-9.#+]+/g).filter(Boolean);
    this.isLoading = true;
    setTimeout(() => {
      this.ideas = this.aiService.generateProjectIdeas(kw);
      this.isLoading = false;
    }, 200);
  }

  clear(): void {
    this.interestInput = '';
    this.ideas = [];
  }
}



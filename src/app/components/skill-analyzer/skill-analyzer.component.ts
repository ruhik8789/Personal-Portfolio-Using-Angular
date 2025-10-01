import { Component } from '@angular/core';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-skill-analyzer',
  templateUrl: './skill-analyzer.component.html',
  styleUrls: ['./skill-analyzer.component.css']
})
export class SkillAnalyzerComponent {
  skillInput: string = '';
  isAnalyzing: boolean = false;
  result: { title: string; content: string; priority: string } | null = null;

  constructor(private aiService: AiService) {}

  async analyze(): Promise<void> {
    const skill = this.skillInput.trim();
    if (!skill) return;
    this.isAnalyzing = true;
    try {
      const analysis = (this.aiService as any).generateSkillAnalysis(skill);
      this.result = {
        title: `${skill.toUpperCase()} Analysis`,
        content: analysis.content,
        priority: analysis.priority
      };
    } finally {
      this.isAnalyzing = false;
    }
  }

  clear(): void {
    this.skillInput = '';
    this.result = null;
  }
}



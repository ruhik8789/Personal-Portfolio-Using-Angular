import { Component } from '@angular/core';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-resume-builder',
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css']
})
export class ResumeBuilderComponent {
  jobDescription: string = '';
  resumeOutput: string = '';
  coverLetterOutput: string = '';
  isGenerating: boolean = false;

  constructor(private aiService: AiService) {}

  async generate(): Promise<void> {
    this.isGenerating = true;
    try {
      this.resumeOutput = this.aiService.generateResumeSection(this.jobDescription || '');
      this.coverLetterOutput = this.aiService.generateCoverLetter(this.jobDescription || '');
    } finally {
      this.isGenerating = false;
    }
  }

  clear(): void {
    this.jobDescription = '';
    this.resumeOutput = '';
    this.coverLetterOutput = '';
  }
}



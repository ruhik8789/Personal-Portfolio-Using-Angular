import { Component, OnInit } from '@angular/core';
import { AiService } from '../../services/ai.service';

export interface GeneratedContent {
  type: 'project_description' | 'skill_analysis' | 'resume_section' | 'cover_letter';
  title: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-content-generator',
  templateUrl: './ai-content-generator.component.html',
  styleUrls: ['./ai-content-generator.component.css']
})
export class AiContentGeneratorComponent implements OnInit {
  selectedType: string = 'project_description';
  inputText: string = '';
  isGenerating: boolean = false;
  generatedContent: GeneratedContent[] = [];

  contentTypes = [
    { value: 'project_description', label: 'Project Description', icon: '📝' },
    { value: 'skill_analysis', label: 'Skill Analysis', icon: '🔍' },
    { value: 'resume_section', label: 'Resume Section', icon: '📄' },
    { value: 'cover_letter', label: 'Cover Letter', icon: '✉️' }
  ];

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    this.loadSavedContent();
  }

  async generateContent(): Promise<void> {
    if (!this.inputText.trim()) return;

    this.isGenerating = true;

    try {
      const content = await this.generateContentByType(this.selectedType, this.inputText);
      
      const generatedItem: GeneratedContent = {
        type: this.selectedType as any,
        title: this.getContentTitle(this.selectedType),
        content: content,
        timestamp: new Date()
      };

      this.generatedContent.unshift(generatedItem);
      this.saveContent();
      this.inputText = '';

    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  private async generateContentByType(type: string, input: string): Promise<string> {
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    switch (type) {
      case 'project_description':
        return this.generateProjectDescription(input);
      case 'skill_analysis':
        return this.generateSkillAnalysis(input);
      case 'resume_section':
        return this.generateResumeSection(input);
      case 'cover_letter':
        return this.generateCoverLetter(input);
      default:
        return 'Generated content based on your input.';
    }
  }

  private generateProjectDescription(input: string): string {
    const templates = [
      `**Project Overview:**\nA comprehensive ${input} solution built with modern web technologies, featuring responsive design and intuitive user experience.\n\n**Key Features:**\n• User-friendly interface\n• Real-time data processing\n• Scalable architecture\n• Cross-platform compatibility\n\n**Technologies Used:**\n• Frontend: Angular, TypeScript, SCSS\n• Backend: Node.js, Express\n• Database: MongoDB\n• Deployment: Firebase, Docker`,
      
      `**${input} - Technical Implementation:**\n\nThis project demonstrates advanced full-stack development skills with a focus on performance and user experience.\n\n**Architecture:**\n• Microservices-based design\n• RESTful API implementation\n• Real-time communication\n• Cloud-native deployment\n\n**Achievements:**\n• 40% performance improvement\n• 99.9% uptime\n• 1000+ active users\n• 4.8/5 user rating`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateSkillAnalysis(input: string): string {
    return `**${input.toUpperCase()} - Skill Analysis:**\n\n**Current Proficiency:** Advanced\n**Years of Experience:** 3+ years\n\n**Strengths:**\n• Deep understanding of core concepts\n• Experience with modern frameworks\n• Strong problem-solving abilities\n• Continuous learning mindset\n\n**Areas for Growth:**\n• Advanced optimization techniques\n• Emerging technologies\n• Leadership and mentoring\n• Industry best practices\n\n**Recommended Learning Path:**\n1. Advanced ${input} patterns\n2. Performance optimization\n3. Testing strategies\n4. Architecture design\n\n**Resources:**\n• Official documentation\n• Online courses\n• Community forums\n• Open source projects`;
  }

  private generateResumeSection(input: string): string {
    return `**${input} - Professional Experience:**\n\n**Senior ${input} Developer** | Company Name | 2021 - Present\n\n• Led development of enterprise-level ${input} applications serving 10,000+ users\n• Implemented modern development practices including CI/CD, automated testing, and code reviews\n• Collaborated with cross-functional teams to deliver high-quality software solutions\n• Mentored junior developers and conducted technical interviews\n• Reduced application load time by 50% through performance optimization\n\n**Key Achievements:**\n• Successfully delivered 15+ projects on time and within budget\n• Improved team productivity by 30% through process improvements\n• Contributed to open-source projects with 500+ GitHub stars\n• Presented technical solutions at 3 industry conferences`;
  }

  private generateCoverLetter(input: string): string {
    return `**Cover Letter for ${input} Position:**\n\nDear Hiring Manager,\n\nI am writing to express my strong interest in the ${input} position at your company. With over 5 years of experience in full-stack development and a passion for creating innovative solutions, I am confident that I would be a valuable addition to your team.\n\n**Why I'm a Great Fit:**\n• Proven track record of delivering high-quality software solutions\n• Strong technical skills in modern web technologies\n• Excellent problem-solving and communication abilities\n• Passionate about continuous learning and professional growth\n\n**What I Can Bring:**\n• Expertise in ${input} development\n• Experience with agile methodologies\n• Strong collaboration and leadership skills\n• Commitment to writing clean, maintainable code\n\nI am excited about the opportunity to contribute to your team and help drive innovation in the ${input} space. I would welcome the chance to discuss how my skills and experience align with your needs.\n\nBest regards,\n[Raghav Bharadwaj]`;
  }

  private getContentTitle(type: string): string {
    const titles: { [key: string]: string } = {
      'project_description': 'Project Description',
      'skill_analysis': 'Skill Analysis',
      'resume_section': 'Resume Section',
      'cover_letter': 'Cover Letter'
    };
    return titles[type] || 'Generated Content';
  }

  copyToClipboard(content: string): void {
    navigator.clipboard.writeText(content).then(() => {
      // You could add a toast notification here
      console.log('Content copied to clipboard');
    });
  }

  deleteContent(index: number): void {
    this.generatedContent.splice(index, 1);
    this.saveContent();
  }

  private saveContent(): void {
    localStorage.setItem('ai-generated-content', JSON.stringify(this.generatedContent));
  }

  private loadSavedContent(): void {
    const saved = localStorage.getItem('ai-generated-content');
    if (saved) {
      this.generatedContent = JSON.parse(saved);
    }
  }

  clearAllContent(): void {
    this.generatedContent = [];
    this.saveContent();
  }
}

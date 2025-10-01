import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'project_recommendation' | 'skill_analysis' | 'error';
  metadata?: any;
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  technologies: string[];
  reason: string;
  matchScore: number;
}

export interface SkillAnalysis {
  skill: string;
  currentLevel: string;
  suggestedImprovements: string[];
  resources: string[];
  priority: 'high' | 'medium' | 'low';
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private chatHistory = new BehaviorSubject<ChatMessage[]>([]);
  public chatHistory$ = this.chatHistory.asObservable();

  // Portfolio data for AI context
  private portfolioData = {
    name: "Raghav Bharadwaj",
    title: "Full Stack Developer",
    skills: ["Angular", "React", "Node.js", "TypeScript", "Firebase", "Python", "AI/ML"],
    experience: "5+ years",
    projects: [
      {
        title: "E-Commerce Platform",
        technologies: ["Angular", "Firebase", "Stripe"],
        description: "Full-featured e-commerce solution"
      },
      {
        title: "AI-Powered Portfolio",
        technologies: ["Angular", "OpenAI", "Firebase"],
        description: "Interactive portfolio with AI assistant"
      }
    ],
    interests: ["Web Development", "AI/ML", "Cloud Computing", "Open Source"]
  };

  constructor() {
    this.initializeChat();
  }

  // Public accessor for export features
  getPortfolio(): { name: string; title: string; experience: string; skills: string[]; projects: { title: string; technologies: string[]; description: string }[]; interests: string[] } {
    return JSON.parse(JSON.stringify(this.portfolioData));
  }

  private initializeChat(): void {
    const welcomeMessage: ChatMessage = {
      id: '1',
      content: `Hi! I'm your AI portfolio assistant. I can help you explore my projects, analyze skills, recommend learning paths, or answer questions about my experience. What would you like to know?`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    this.chatHistory.next([welcomeMessage]);
  }

  async sendMessage(userMessage: string): Promise<void> {
    // Add user message to chat
    const userChatMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    const currentHistory = this.chatHistory.value;
    this.chatHistory.next([...currentHistory, userChatMessage]);

    try {
      // Analyze the user's intent
      const intent = await this.analyzeIntent(userMessage);
      
      let response: ChatMessage;

      switch (intent.type) {
        case 'project_inquiry':
          response = await this.handleProjectInquiry(userMessage, intent);
          break;
        case 'skill_analysis':
          response = await this.handleSkillAnalysis(userMessage, intent);
          break;
        case 'skills_question':
          response = await this.handleSkillsQuestion();
          break;
        case 'experience_question':
          response = await this.handleExperienceQuestion();
          break;
        case 'project_details':
          response = await this.handleProjectDetails(userMessage);
          break;
        case 'general_question':
          response = await this.handleGeneralQuestion(userMessage);
          break;
        case 'project_recommendation':
          response = await this.handleProjectRecommendation(userMessage, intent);
          break;
        default:
          response = await this.handleGeneralQuestion(userMessage);
      }

      const updatedHistory = [...this.chatHistory.value, response];
      this.chatHistory.next(updatedHistory);

    } catch (error) {
      console.error('AI Service Error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again or rephrase your question.",
        isUser: false,
        timestamp: new Date(),
        type: 'error'
      };
      this.chatHistory.next([...this.chatHistory.value, errorMessage]);
    }
  }

  private async analyzeIntent(message: string): Promise<any> {
    const lowerMessage = message.toLowerCase();

    // Direct Q&A patterns
    const asksSkills = /(what\s+skills|your\s+skills|skills\s+do\s+you\s+have|list\s+skills)/i.test(lowerMessage);
    if (asksSkills) {
      return { type: 'skills_question', keywords: this.extractKeywords(message) };
    }

    const asksExperience = /(how\s+long|years\s+of\s+experience|experience\s+do\s+you\s+have|total\s+experience)/i.test(lowerMessage);
    if (asksExperience) {
      return { type: 'experience_question', keywords: this.extractKeywords(message) };
    }

    // Project details: mentions a known project title
    const mentionsProjectByName = this.portfolioData.projects.some(p => lowerMessage.includes(p.title.toLowerCase()));
    if (mentionsProjectByName || /tell\s+me\s+about\s+|details\s+about\s+/.test(lowerMessage)) {
      return { type: 'project_details', keywords: this.extractKeywords(message) };
    }

    // Category intents
    if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
      return { type: 'project_inquiry', keywords: this.extractKeywords(message) };
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('improve')) {
      return { type: 'skill_analysis', keywords: this.extractKeywords(message) };
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('what should')) {
      return { type: 'project_recommendation', keywords: this.extractKeywords(message) };
    }
    
    return { type: 'general_question', keywords: this.extractKeywords(message) };
  }

  private extractKeywords(message: string): string[] {
    const lower = message.toLowerCase();
    const techKeywords = ['angular', 'react', 'node', 'python', 'javascript', 'typescript', 'firebase', 'ai', 'ml'];
    const projectTokens = this.portfolioData.projects
      .flatMap(p => p.title.toLowerCase().split(/[^a-z0-9]+/g))
      .filter(t => t && t.length > 2);
    const all = Array.from(new Set([...techKeywords, ...projectTokens]));
    return all.filter(keyword => lower.includes(keyword));
  }

  private async handleProjectInquiry(message: string, intent: any): Promise<ChatMessage> {
    const relevantProjects = this.portfolioData.projects.filter(project => 
      intent.keywords.some((keyword: string) => 
        project.technologies.some(tech => 
          tech.toLowerCase().includes(keyword)
        )
      )
    );

    if (relevantProjects.length > 0) {
      const projectList = relevantProjects.map(project => 
        `• **${project.title}**: ${project.description} (${project.technologies.join(', ')})`
      ).join('\n');

      return {
        id: Date.now().toString(),
        content: `Based on your interest in ${intent.keywords.join(', ')}, here are some relevant projects:\n\n${projectList}\n\nWould you like to know more about any specific project?`,
        isUser: false,
        timestamp: new Date(),
        type: 'project_recommendation',
        metadata: { projects: relevantProjects }
      };
    } else {
      return {
        id: Date.now().toString(),
        content: `Here are all my projects:\n\n${this.portfolioData.projects.map(p => 
          `• **${p.title}**: ${p.description} (${p.technologies.join(', ')})`
        ).join('\n')}\n\nWhich one interests you most?`,
        isUser: false,
        timestamp: new Date(),
        type: 'project_recommendation',
        metadata: { projects: this.portfolioData.projects }
      };
    }
  }

  private async handleSkillAnalysis(message: string, intent: any): Promise<ChatMessage> {
    const mentionedSkills = intent.keywords.filter((keyword: string) => 
      this.portfolioData.skills.some(skill => 
        skill.toLowerCase().includes(keyword)
      )
    );

    if (mentionedSkills.length > 0) {
      const analysis = this.generateSkillAnalysis(mentionedSkills[0]);
      return {
        id: Date.now().toString(),
        content: `**${mentionedSkills[0].toUpperCase()} Analysis:**\n\n${analysis.content}`,
        isUser: false,
        timestamp: new Date(),
        type: 'skill_analysis',
        metadata: { analysis }
      };
    } else {
      return {
        id: Date.now().toString(),
        content: `I have experience with: ${this.portfolioData.skills.join(', ')}\n\nWhich skill would you like me to analyze or discuss?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }
  }

  private async handleProjectRecommendation(message: string, intent: any): Promise<ChatMessage> {
    const recommendations = this.generateProjectRecommendations(intent.keywords);
    
    return {
      id: Date.now().toString(),
      content: `**Project Recommendations:**\n\n${recommendations.map(rec => 
        `• **${rec.title}**: ${rec.description}\n  *Why: ${rec.reason}*\n  *Match: ${rec.matchScore}%*`
      ).join('\n\n')}`,
      isUser: false,
      timestamp: new Date(),
      type: 'project_recommendation',
      metadata: { recommendations }
    };
  }

  private async handleSkillsQuestion(): Promise<ChatMessage> {
    const skills = this.portfolioData.skills.join(', ');
    return {
      id: Date.now().toString(),
      content: `My core skills include: ${skills}.\n\nYou can ask for an analysis of any skill to see strengths, growth areas, and resources.`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
  }

  private async handleExperienceQuestion(): Promise<ChatMessage> {
    return {
      id: Date.now().toString(),
      content: `I have ${this.portfolioData.experience} of professional experience as a ${this.portfolioData.title}.` ,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
  }

  private async handleProjectDetails(message: string): Promise<ChatMessage> {
    const lower = message.toLowerCase();
    // Simple fuzzy: score by number of title tokens appearing in message
    const scored = this.portfolioData.projects.map(p => {
      const tokens = p.title.toLowerCase().split(/[^a-z0-9]+/g).filter(t => t);
      const score = tokens.reduce((acc, t) => acc + (lower.includes(t) ? 1 : 0), 0);
      return { project: p, score };
    }).sort((a, b) => b.score - a.score);

    const top = scored[0];
    if (top && top.score > 0) {
      const p = top.project as { title: string; description: string; technologies: string[] };
      return {
        id: Date.now().toString(),
        content: `**${p.title}**\n${p.description}\n\nTechnologies: ${p.technologies.join(', ')}\n\nWould you like to know about challenges, architecture, or results?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
        metadata: { project: p }
      };
    }

    // If no fuzzy match, list available projects
    return {
      id: Date.now().toString(),
      content: `I couldn't identify the project. Here are my projects:\n\n${this.portfolioData.projects.map(p => `• **${p.title}**: ${p.description}`).join('\n')}\n\nPlease mention the project name for details.`,
      isUser: false,
      timestamp: new Date(),
      type: 'text',
      metadata: { projects: this.portfolioData.projects }
    };
  }

  private async handleGeneralQuestion(message: string): Promise<ChatMessage> {
    // Deterministic, context-aware fallback
    const content = `I'm a ${this.portfolioData.title} with ${this.portfolioData.experience}.\nSkills: ${this.portfolioData.skills.join(', ')}.\nProjects include ${this.portfolioData.projects.map(p => p.title).join(', ')}.\nAsk me: "What are your skills?", "Tell me about ${this.portfolioData.projects[0].title}", or "How many years of experience do you have?"`;

    return {
      id: Date.now().toString(),
      content,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
  }

  private generateSkillAnalysis(skill: string): any {
    const skillData: { [key: string]: any } = {
      'angular': {
        content: `**Current Level**: Advanced\n**Strengths**: Component architecture, RxJS, state management\n**Areas for Growth**: Angular Universal, Micro-frontends\n**Resources**: Angular documentation, NgRx tutorials`,
        priority: 'high'
      },
      'react': {
        content: `**Current Level**: Intermediate\n**Strengths**: Hooks, Context API, component composition\n**Areas for Growth**: Server Components, Concurrent features\n**Resources**: React 18 docs, Next.js tutorials`,
        priority: 'medium'
      },
      'ai': {
        content: `**Current Level**: Learning\n**Strengths**: Basic ML concepts, API integration\n**Areas for Growth**: Deep learning, model training\n**Resources**: TensorFlow tutorials, OpenAI docs`,
        priority: 'high'
      }
    };

    return skillData[skill.toLowerCase()] || {
      content: `I'm continuously learning and improving my ${skill} skills. What specific aspect would you like to discuss?`,
      priority: 'medium'
    };
  }

  // Local resume/cover letter generators
  generateResumeSection(input: string): string {
    const summary = `Professional Summary\n${this.portfolioData.title} with ${this.portfolioData.experience}. Focus: ${this.portfolioData.skills.slice(0, 5).join(', ')}.`;
    const achievements = `Key Achievements\n- Built ${this.portfolioData.projects[0].title}\n- Created ${this.portfolioData.projects[1].title}`;
    const tailored = input ? `\nTarget Role Context\n- ${input}` : '';
    return `${summary}\n\n${achievements}${tailored}`;
  }

  generateCoverLetter(input: string): string {
    const intro = `Dear Hiring Manager,`;
    const body = `I am excited to apply for this opportunity. As a ${this.portfolioData.title} with ${this.portfolioData.experience}, I have delivered projects such as ${this.portfolioData.projects.map(p => p.title).join(', ')} using ${this.portfolioData.skills.join(', ')}.`;
    const fit = input ? `\n\nAlignment\nYour description mentions: ${input}. My background aligns strongly with these requirements.` : '';
    const close = `\n\nSincerely,\n${this.portfolioData.name}`;
    return `${intro}\n\n${body}${fit}${close}`;
  }

  // Local project ideas generator with steps
  generateProjectIdeas(keywords: string[]): ProjectRecommendation[] {
    const ideas = this.generateProjectRecommendations(keywords);
    return ideas;
  }

  private generateProjectRecommendations(keywords: string[]): ProjectRecommendation[] {
    const allProjects = [
      {
        title: "AI-Powered E-commerce",
        description: "E-commerce platform with AI recommendations and chatbot",
        technologies: ["Angular", "Node.js", "OpenAI", "MongoDB"],
        reason: "Combines your interest in AI with e-commerce",
        matchScore: 95
      },
      {
        title: "Real-time Analytics Dashboard",
        description: "Dashboard with real-time data visualization and AI insights",
        technologies: ["React", "D3.js", "WebSocket", "Python"],
        reason: "Perfect for data visualization and AI integration",
        matchScore: 88
      },
      {
        title: "Smart Portfolio Generator",
        description: "AI-powered portfolio generator with dynamic content",
        technologies: ["Angular", "OpenAI", "Firebase", "TypeScript"],
        reason: "Leverages AI for content generation",
        matchScore: 92
      }
    ];

    return allProjects.filter(project => 
      keywords.some(keyword => 
        project.technologies.some(tech => 
          tech.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    ).slice(0, 3);
  }

  clearChat(): void {
    this.initializeChat();
  }

  getChatHistory(): ChatMessage[] {
    return this.chatHistory.value;
  }
}

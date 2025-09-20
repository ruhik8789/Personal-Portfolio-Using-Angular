import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

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
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = 'your-openai-api-key'; // Replace with your actual API key
  
  private chatHistory = new BehaviorSubject<ChatMessage[]>([]);
  public chatHistory$ = this.chatHistory.asObservable();

  // Portfolio data for AI context
  private portfolioData = {
    name: "Your Name",
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

  constructor(private http: HttpClient) {
    this.initializeChat();
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
    const techKeywords = ['angular', 'react', 'node', 'python', 'javascript', 'typescript', 'firebase', 'ai', 'ml'];
    return techKeywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    );
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

  private async handleGeneralQuestion(message: string): Promise<ChatMessage> {
    // For demo purposes, return contextual responses
    const responses = [
      `I'm a ${this.portfolioData.title} with ${this.portfolioData.experience} of experience. I specialize in ${this.portfolioData.skills.slice(0, 3).join(', ')} and more!`,
      `I'm passionate about ${this.portfolioData.interests.join(', ')}. Feel free to ask about my projects or skills!`,
      `I love building innovative solutions using modern technologies. What specific area interests you?`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      content: randomResponse,
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

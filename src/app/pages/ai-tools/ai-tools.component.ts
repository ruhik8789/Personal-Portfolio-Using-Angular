import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ai-tools',
  templateUrl: './ai-tools.component.html',
  styleUrls: ['./ai-tools.component.css']
})
export class AiToolsComponent implements OnInit {
  activeTab = 'content-generator';

  tabs = [
    { id: 'content-generator', label: 'Content Generator', icon: '🤖' },
    { id: 'skill-analyzer', label: 'Skill Analyzer', icon: '🔍' },
    { id: 'resume-builder', label: 'Resume Builder', icon: '📄' },
    { id: 'project-ideas', label: 'Project Ideas', icon: '💡' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
}

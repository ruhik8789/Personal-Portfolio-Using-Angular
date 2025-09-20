import { Component, OnInit } from '@angular/core';
import { FirebaseService, Project } from '../../services/firebase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  activeFilter = 'all';
  projects$: Observable<Project[]>;
  filteredProjects: Project[] = [];
  loading = true;

  constructor(private firebaseService: FirebaseService) {
    this.projects$ = this.firebaseService.getProjects();
  }

  ngOnInit(): void {
    this.initializeFiltering();
    this.loadProjects();
  }

  loadProjects(): void {
    this.projects$.subscribe(projects => {
      this.filteredProjects = projects;
      this.loading = false;
      // Apply current filter after loading
      setTimeout(() => this.filterProjects(this.activeFilter), 100);
    });
  }

  initializeFiltering(): void {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.filterProjects(filter || 'all');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  filterProjects(filter: string): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredProjects = this.filteredProjects;
    } else {
      this.filteredProjects = this.filteredProjects.filter(project => 
        project.technologies.some(tech => 
          tech.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }

  getProjectCategory(technologies: string[]): string {
    // Return the first technology as the category for filtering
    return technologies[0]?.toLowerCase() || 'other';
  }

  getTechColor(tech: string): string {
    const colors: { [key: string]: string } = {
      'angular': '#dd0031',
      'react': '#61dafb',
      'javascript': '#f7df1e',
      'typescript': '#3178c6',
      'node': '#68a063',
      'vue': '#4fc08d',
      'svelte': '#ff3e00'
    };
    return colors[tech?.toLowerCase()] || '#6366f1';
  }
}
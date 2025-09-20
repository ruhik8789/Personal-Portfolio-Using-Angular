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
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.classList.add('show');
      } else {
        card.classList.add('hidden');
        card.classList.remove('show');
      }
    });
  }
}
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('hero', { static: true, read: ElementRef }) heroRef!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const hero = this.heroRef?.nativeElement || document.querySelector('.hero');
    if (!hero) return;
    const title = (hero as HTMLElement).querySelector('.hero__title');
    const subtitle = (hero as HTMLElement).querySelector('.hero__subtitle');
    const ctas = (hero as HTMLElement).querySelectorAll('.btn');

    gsap.from(title, { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' });
    gsap.from(subtitle, { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
    gsap.from(ctas, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.2, stagger: 0.1 });
  }
}

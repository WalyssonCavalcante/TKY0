import {
  Component,
  ChangeDetectionStrategy,
  afterNextRender,
  ElementRef,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  footerEl = viewChild.required<ElementRef<HTMLElement>>('footerEl');
  tagline = viewChild.required<ElementRef<HTMLParagraphElement>>('tagline');

  constructor() {
    afterNextRender(() => {
      gsap.from(this.tagline().nativeElement, {
        opacity: 0,
        y: 40,
        duration: 1.0,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: this.footerEl().nativeElement,
          start: 'top 85%',
        },
      });
    });
  }
}

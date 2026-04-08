import {
  Directive,
  ElementRef,
  input,
  afterNextRender,
  inject,
  OnDestroy,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({ selector: '[appParallaxImg]' })
export class ParallaxImgDirective implements OnDestroy {
  speed = input<number>(15);
  private el = inject(ElementRef);
  private st!: globalThis.ScrollTrigger;

  constructor() {
    afterNextRender(() => {
      if (window.innerWidth <= 768) return;
      const s = this.speed();
      this.st = ScrollTrigger.create({
        trigger: this.el.nativeElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(this.el.nativeElement, {
            yPercent: (self.progress - 0.5) * s * 2,
          });
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.st?.kill();
  }
}

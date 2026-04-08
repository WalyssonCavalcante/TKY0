import {
  Component,
  ElementRef,
  viewChild,
  afterNextRender,
  inject,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeService } from '../../core/three.service';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnDestroy {
  private threeService = inject(ThreeService);
  private scrollTriggers: globalThis.ScrollTrigger[] = [];

  heroSection = viewChild.required<ElementRef<HTMLElement>>('heroSection');
  heroBg = viewChild.required<ElementRef<HTMLDivElement>>('heroBg');
  threeCanvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('threeCanvas');
  eyebrow =
    viewChild.required<ElementRef<HTMLParagraphElement>>('eyebrow');
  line1 = viewChild.required<ElementRef<HTMLSpanElement>>('line1');
  line2 = viewChild.required<ElementRef<HTMLSpanElement>>('line2');
  heroSub =
    viewChild.required<ElementRef<HTMLParagraphElement>>('heroSub');
  scrollIndicator =
    viewChild.required<ElementRef<HTMLDivElement>>('scrollIndicator');

  constructor() {
    afterNextRender(() => {
      this.initThree();
      this.initAnimations();
      this.initParallax();
    });
  }

  private initThree(): void {
    this.threeService.init(this.threeCanvas().nativeElement);
  }

  private initAnimations(): void {
    const tl = gsap.timeline({ delay: 3.8 });

    tl.to(this.eyebrow().nativeElement, {
      opacity: 1,
      duration: 1.0,
      ease: 'expo.out',
    })
      .to(
        [
          this.line1().nativeElement,
          this.line2().nativeElement,
        ],
        { y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 },
        '-=0.6'
      )
      .to(
        this.heroSub().nativeElement,
        { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out' },
        '-=0.7'
      )
      .to(
        this.scrollIndicator().nativeElement,
        { opacity: 1, duration: 0.8, ease: 'expo.out' },
        '-=0.5'
      );
  }

  private initParallax(): void {
    const tween = gsap.to(this.heroBg().nativeElement, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: this.heroSection().nativeElement,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    const st = ScrollTrigger.getById(tween.scrollTrigger?.vars?.id ?? '') ?? tween.scrollTrigger;
    if (st) this.scrollTriggers.push(st as globalThis.ScrollTrigger);
  }

  ngOnDestroy(): void {
    this.threeService.destroy();
    this.scrollTriggers.forEach((t) => t.kill());
  }
}

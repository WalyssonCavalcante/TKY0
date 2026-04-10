import {
  Component,
  ElementRef,
  viewChild,
  afterNextRender,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-fujisan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fujisan.component.html',
  styleUrl: './fujisan.component.scss',
})
export class FujisanComponent implements OnDestroy {
  private scrollTriggers: globalThis.ScrollTrigger[] = [];
  private tweens: gsap.core.Tween[] = [];

  sectionEl = viewChild.required<ElementRef<HTMLElement>>('sectionEl');
  layerBack = viewChild.required<ElementRef<HTMLDivElement>>('layerBack');
  layerMid = viewChild.required<ElementRef<HTMLDivElement>>('layerMid');
  layerFront = viewChild.required<ElementRef<HTMLDivElement>>('layerFront');
  badgeEl = viewChild.required<ElementRef<HTMLDivElement>>('badgeEl');

  constructor() {
    afterNextRender(() => this.initAnimations());
  }

  private initAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    const section = this.sectionEl().nativeElement;
    const back = this.layerBack().nativeElement;
    const mid = this.layerMid().nativeElement;
    const front = this.layerFront().nativeElement;
    const badge = this.badgeEl().nativeElement;

    // ─── Parallax layers (different speeds = depth) ─────
    // Back: Fuji moves slowest (subtle drift)
    const stBack = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(back, { yPercent: (self.progress - 0.5) * 8 });
      },
    });

    // Mid: Text moves at medium speed
    const stMid = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(mid, { yPercent: (self.progress - 0.5) * 20 });
      },
    });

    // Front: Sakura — no parallax, falls automatically
    this.scrollTriggers.push(stBack, stMid);

    // ─── Entrance reveal ────────────────────────────────
    const petals = front.querySelectorAll<HTMLElement>('.fujisan__petal');

    const stReveal = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        // Fade in badge
        gsap.to(badge, { opacity: 1, duration: 1, ease: 'power2.out' });

        // Each petal falls continuously from top to bottom, looping
        petals.forEach((petal, i) => {
          const duration = 8 + (i % 5) * 3;           // 8–20s varied
          const xDrift = (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 15); // gentle sway

          // Start from scattered positions above viewport
          gsap.set(petal, {
            y: -(60 + (i % 4) * 40),
            opacity: 0.15 + (i % 4) * 0.05,
          });

          const tw = gsap.to(petal, {
            y: front.offsetHeight + 60,
            x: `+=${xDrift}`,
            rotation: (i % 2 === 0 ? 1 : -1) * (90 + i * 20),
            duration,
            ease: 'none',
            repeat: -1,
            delay: i * 0.8,                            // stagger start
            modifiers: {
              // sway left-right with sine wave while falling
              x: (x) => {
                const px = parseFloat(x);
                return `${px + Math.sin(Date.now() / (1400 + i * 200)) * 12}px`;
              },
            },
          });

          this.tweens.push(tw);
        });
      },
    });

    this.scrollTriggers.push(stReveal);
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.tweens.forEach((tw) => tw.kill());
  }
}

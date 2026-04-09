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
  selector: 'app-map-spread',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-spread.component.html',
  styleUrl: './map-spread.component.scss',
})
export class MapSpreadComponent implements OnDestroy {
  private scrollTriggers: globalThis.ScrollTrigger[] = [];

  sectionEl = viewChild.required<ElementRef<HTMLElement>>('sectionEl');
  svgEl = viewChild.required<ElementRef<SVGElement>>('svgEl');

  constructor() {
    afterNextRender(() => this.initAnimations());
  }

  private initAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    const section = this.sectionEl().nativeElement;
    const svgEl = this.svgEl().nativeElement;

    const drawPaths = Array.from(
      svgEl.querySelectorAll<SVGPathElement>('.map__draw'),
    );
    const dots = svgEl.querySelectorAll<SVGElement>('.map__dot');
    const labelGroups = svgEl.querySelectorAll<SVGElement>('.map__label-group');
    const headerEls = section.querySelectorAll<HTMLElement>('.map-spread__animate');
    const legendEl = section.querySelector<HTMLElement>('.map-spread__legend');

    drawPaths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
    });

    gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
    gsap.set(labelGroups, { opacity: 0 });
    gsap.set(headerEls, { opacity: 0, y: 24 });
    if (legendEl) gsap.set(legendEl, { opacity: 0, y: 16 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        tl.to(headerEls, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
        });

        tl.to(drawPaths, {
          strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', stagger: 0.3,
        }, '-=0.2');

        tl.to(dots, {
          opacity: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(2)',
        }, '-=1.8');

        tl.to(labelGroups, {
          opacity: 1, duration: 0.5, stagger: 0.06,
        }, '-=1.2');

        if (legendEl) {
          tl.to(legendEl, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
        }
      },
    });

    this.scrollTriggers.push(st);
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
  }
}

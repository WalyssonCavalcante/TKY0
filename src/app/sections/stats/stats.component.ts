import {
  Component,
  ElementRef,
  viewChildren,
  afterNextRender,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  sub: string;
}

@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnDestroy {
  private scrollTriggers: globalThis.ScrollTrigger[] = [];
  statValues = viewChildren<ElementRef<HTMLSpanElement>>('statValue');
  statItems = viewChildren<ElementRef<HTMLElement>>('statItem');

  stats: Stat[] = [
    {
      value: 37,
      suffix: 'M',
      label: 'Habitantes',
      sub: 'Maior metrópole do mundo',
    },
    {
      value: 23,
      suffix: '',
      label: 'Bairros especiais',
      sub: 'Cada um, uma cidade',
    },
    {
      value: 887,
      suffix: 'km²',
      label: 'Área total',
      sub: 'Em constante expansão',
    },
    {
      value: 1457,
      suffix: '',
      label: 'Anos de história',
      sub: 'Fundada em 567 d.C.',
    },
  ];

  constructor() {
    afterNextRender(() => this.initCountUp());
  }

  private initCountUp(): void {
    const valueEls = this.statValues().map((r) => r.nativeElement);
    const itemEls = this.statItems().map((r) => r.nativeElement);

    itemEls.forEach((itemEl, i) => {
      const stat = this.stats[i];
      const el = valueEls[i];
      const obj = { val: 0 };

      const tween = gsap.to(obj, {
        val: stat.value,
        duration: 2.4,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString();
        },
        scrollTrigger: {
          trigger: itemEl,
          start: 'top 82%',
          once: true,
        },
      });
      if (tween.scrollTrigger) {
        this.scrollTriggers.push(tween.scrollTrigger as unknown as globalThis.ScrollTrigger);
      }
    });

    const staggerTween = gsap.from(itemEls, {
      opacity: 0,
      y: 60,
      duration: 1.0,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: itemEls[0]?.closest('.stats'),
        start: 'top 78%',
      },
    });
    if (staggerTween.scrollTrigger) {
      this.scrollTriggers.push(staggerTween.scrollTrigger as unknown as globalThis.ScrollTrigger);
    }
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((t) => t.kill());
  }
}

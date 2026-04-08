import {
  Component,
  ElementRef,
  viewChild,
  output,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.scss',
})
export class PreloaderComponent {
  loaded = output<void>();

  preloader = viewChild.required<ElementRef<HTMLDivElement>>('preloader');
  counter = viewChild.required<ElementRef<HTMLDivElement>>('counter');
  kanji = viewChild.required<ElementRef<HTMLDivElement>>('kanji');
  barFill = viewChild.required<ElementRef<HTMLDivElement>>('barFill');
  panelTop = viewChild.required<ElementRef<HTMLDivElement>>('panelTop');
  panelBottom = viewChild.required<ElementRef<HTMLDivElement>>('panelBottom');

  constructor() {
    afterNextRender(() => this.runTimeline());
  }

  private runTimeline(): void {
    const counterEl = this.counter().nativeElement;
    const kanjiEl = this.kanji().nativeElement;
    const barEl = this.barFill().nativeElement;
    const panelTopEl = this.panelTop().nativeElement;
    const panelBotEl = this.panelBottom().nativeElement;
    const rootEl = this.preloader().nativeElement;

    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => this.loaded.emit(),
    });

    tl.to(barEl, { width: '100%', duration: 2.4, ease: 'power2.inOut' }, 0)
      .to(
        obj,
        {
          val: 100,
          duration: 2.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            counterEl.textContent = Math.round(obj.val)
              .toString()
              .padStart(2, '0');
          },
        },
        0
      )
      .to(
        kanjiEl,
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
        1.2
      )
      .to(
        panelTopEl,
        { yPercent: -100, duration: 1.3, ease: 'power4.inOut' },
        2.6
      )
      .to(
        panelBotEl,
        { yPercent: 100, duration: 1.3, ease: 'power4.inOut' },
        2.6
      )
      .to(
        rootEl,
        { autoAlpha: 0, duration: 0.2, pointerEvents: 'none' },
        3.7
      );
  }
}

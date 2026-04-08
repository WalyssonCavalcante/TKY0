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

interface Panel {
  num: string;
  quote: string;
  desc: string;
  kanji: string;
}

@Component({
  selector: 'app-manifesto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manifesto.component.html',
  styleUrl: './manifesto.component.scss',
})
export class ManifestoComponent implements OnDestroy {
  private scrollTrigger?: globalThis.ScrollTrigger;
  manifestoSection =
    viewChild.required<ElementRef<HTMLElement>>('manifestoSection');
  track = viewChild.required<ElementRef<HTMLDivElement>>('track');
  progressFill =
    viewChild.required<ElementRef<HTMLDivElement>>('progressFill');
  panelCounter =
    viewChild.required<ElementRef<HTMLDivElement>>('panelCounter');

  panels: Panel[] = [
    {
      num: '01',
      kanji: '静',
      quote: 'A cidade que nunca se acomoda',
      desc: 'Onde cada esquina guarda um século de intenção acumulada, esperando ser decifrada.',
    },
    {
      num: '02',
      kanji: '動',
      quote: 'Caos projetado em beleza',
      desc: 'Sob o ruído vive uma precisão que nenhuma planta baixa poderia conter ou prever.',
    },
    {
      num: '03',
      kanji: '季',
      quote: 'Estações como religião',
      desc: 'A natureza inscrita em cada ritual diário, cada refeição preparada, cada gesto feito.',
    },
    {
      num: '04',
      kanji: '記',
      quote: 'Futuro construído sobre memória',
      desc: 'O amanhã é sempre moldado pelo peso do que veio antes — nunca apagado.',
    },
  ];

  private isMobile = false;

  constructor() {
    afterNextRender(() => {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.initHorizontalScroll();
      }
    });
  }

  private initHorizontalScroll(): void {
    const trackEl = this.track().nativeElement;
    const fillEl = this.progressFill().nativeElement;
    const counterEl = this.panelCounter().nativeElement;
    const totalScroll = trackEl.scrollWidth - window.innerWidth;

    const tween = gsap.to(trackEl, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: this.manifestoSection().nativeElement,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          fillEl.style.width = self.progress * 100 + '%';
          const idx = Math.min(
            Math.ceil(self.progress * this.panels.length),
            this.panels.length
          );
          counterEl.textContent = `${idx.toString().padStart(2, '0')} / 04`;
        },
      },
    });
    if (tween.scrollTrigger) {
      this.scrollTrigger = tween.scrollTrigger as unknown as globalThis.ScrollTrigger;
    }
  }

  ngOnDestroy(): void {
    this.scrollTrigger?.kill();
  }
}

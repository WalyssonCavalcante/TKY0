import {
  Component,
  ElementRef,
  viewChildren,
  viewChild,
  afterNextRender,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Alley {
  num: string;
  name: string;
  nameJp: string;
  district: string;
  description: string;
  img: string;
  sizes: string;
}

@Component({
  selector: 'app-hidden-alleys',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hidden-alleys.component.html',
  styleUrl: './hidden-alleys.component.scss',
})
export class HiddenAlleysComponent implements OnDestroy {
  private scrollTriggers: globalThis.ScrollTrigger[] = [];

  sectionEl = viewChild.required<ElementRef<HTMLElement>>('sectionEl');
  cardEls = viewChildren<ElementRef<HTMLElement>>('cardEl');

  alleys: Alley[] = [
    {
      num: '01',
      name: 'Omoide Yokocho',
      nameJp: '思い出横丁',
      district: 'Shinjuku',
      description: 'O Beco da Memória. Espetinhos de yakitori e fumaça que guardam a era Showa.',
      img: 'omoide-yokocho.webp',
      sizes: '(max-width: 768px) 100vw, 50vw',
    },
    {
      num: '02',
      name: 'Nonbei Yokocho',
      nameJp: 'のんべい横丁',
      district: 'Shibuya',
      description: 'O Beco dos Bêbados. Intimista e charmoso, escondido atrás do caos de Shibuya.',
      img: 'nonbei-yokocho.jpg',
      sizes: '(max-width: 768px) 100vw, 50vw',
    },
    {
      num: '03',
      name: 'Ameyoko',
      nameJp: 'アメヤ横丁',
      district: 'Ueno',
      description: 'Mercado vibrante sob os trilhos do trem — comida de rua e memória viva.',
      img: 'ameyoko-yokocho.webp',
      sizes: '(max-width: 768px) 100vw, 50vw',
    },
    {
      num: '04',
      name: 'Hoppy Street',
      nameJp: 'ホッピー通り',
      district: 'Asakusa',
      description: 'Mesas ao ar livre, carne cozida e hoppy — o Tokyo que o turista raramente encontra.',
      img: 'hoppy-street.webp',
      sizes: '(max-width: 768px) 100vw, 50vw',
    },
  ];

  constructor() {
    afterNextRender(() => this.initAnimations());
  }

  private initAnimations(): void {
    const cards = this.cardEls().map((r) => r.nativeElement);

    const tween = gsap.from(cards, {
      opacity: 0,
      y: 60,
      duration: 1.0,
      ease: 'expo.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: this.sectionEl().nativeElement,
        start: 'top 75%',
      },
    });

    if (tween.scrollTrigger) {
      this.scrollTriggers.push(tween.scrollTrigger as unknown as globalThis.ScrollTrigger);
    }
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
  }
}

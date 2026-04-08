import {
  Component,
  ElementRef,
  viewChildren,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Story {
  idx: string;
  name: string;
  nameJp: string;
  desc: string;
  img: string;
  size: 'large' | 'wide' | 'small';
  sizes: string;
}

@Component({
  selector: 'app-stories-grid',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stories-grid.component.html',
  styleUrl: './stories-grid.component.scss',
})
export class StoriesGridComponent {
  storyCards = viewChildren<ElementRef<HTMLElement>>('storyCard');

  stories: Story[] = [
    {
      idx: '01',
      name: 'Shibuya',
      nameJp: '渋谷',
      desc: 'O caos mais orquestrado do mundo.',
      img: 'shibuya-cross.webp',
      size: 'large',
      sizes: '(max-width: 768px) 100vw, 42vw',
    },
    {
      idx: '02',
      name: 'Yanaka',
      nameJp: '谷中',
      desc: 'A última vila de Tokyo, congelada no tempo.',
      img: 'yanaka-ginza.webp',
      size: 'wide',
      sizes: '(max-width: 768px) 100vw, 58vw',
    },
    {
      idx: '03',
      name: 'Asakusa',
      nameJp: '浅草',
      desc: 'Onde a devoção encontra o amanhecer neon.',
      img: 'asakusa.webp',
      size: 'small',
      sizes: '(max-width: 768px) 50vw, 33vw',
    },
    {
      idx: '04',
      name: 'Fushimi',
      nameJp: '伏見',
      desc: 'Dez mil portões, um caminho sem fim.',
      img: 'torii-gates.webp',
      size: 'small',
      sizes: '(max-width: 768px) 50vw, 33vw',
    },
    {
      idx: '05',
      name: 'Fujisan',
      nameJp: '富士山',
      desc: 'A testemunha silenciosa de todo o Japão.',
      img: 'fuji-pagoda.webp',
      size: 'small',
      sizes: '(max-width: 768px) 50vw, 33vw',
    },
  ];

  constructor() {
    afterNextRender(() => this.initAnimations());
  }

  private initAnimations(): void {
    const cards = this.storyCards().map((r) => r.nativeElement);

    gsap.from(cards, {
      opacity: 0,
      y: 80,
      duration: 1.1,
      ease: 'expo.out',
      stagger: { amount: 0.5, from: 'start' },
      scrollTrigger: {
        trigger: cards[0]?.closest('.stories'),
        start: 'top 78%',
      },
    });
  }

  onCardMouseMove(event: MouseEvent): void {
    const card = (event.currentTarget as HTMLElement);
    const img = card.querySelector<HTMLElement>('.card__img');
    if (!img) return;

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    gsap.to(img, {
      x: x * -8,
      y: y * -8,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  onCardMouseLeave(event: MouseEvent): void {
    const card = (event.currentTarget as HTMLElement);
    const img = card.querySelector<HTMLElement>('.card__img');
    if (!img) return;

    gsap.to(img, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'expo.out',
      overwrite: 'auto',
    });
  }
}

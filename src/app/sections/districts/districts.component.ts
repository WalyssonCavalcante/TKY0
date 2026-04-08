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
import { NgOptimizedImage } from '@angular/common';
import { ParallaxImgDirective } from '../../shared/directives/parallax-img.directive';

interface District {
  num: string;
  name: string;
  kanji: string;
  body: string;
  statValue: string;
  statUnit: string;
  statLabel: string;
  img: string;
  reverse: boolean;
}

@Component({
  selector: 'app-districts',
  imports: [ParallaxImgDirective, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './districts.component.html',
  styleUrl: './districts.component.scss',
})
export class DistrictsComponent implements OnDestroy {
  private scrollTriggers: globalThis.ScrollTrigger[] = [];
  districtRows = viewChildren<ElementRef<HTMLElement>>('districtRow');

  districts: District[] = [
    {
      num: '01',
      name: 'Shinjuku',
      kanji: '新宿',
      body: 'O motor da Tokyo contemporânea. Onde lutadores de sumô dividem faixas de pedestres com estilistas e assalariados se dissolvem na noite de Kabukichō.',
      statValue: '3.4M',
      statUnit: '',
      statLabel:
        'Passageiros diários — a estação mais movimentada do mundo',
      img: 'shinjuku.webp',
      reverse: false,
    },
    {
      num: '02',
      name: 'Asakusa',
      kanji: '浅草',
      body: 'A alma antiga de Edo. Riquixás ainda percorrem ruas onde o Senso-ji resiste desde 645 d.C., observando a cidade crescer ao seu redor.',
      statValue: '645',
      statUnit: 'd.C.',
      statLabel:
        'Fundação do Senso-ji — o templo mais antigo de Tokyo',
      img: 'torii-gates.webp',
      reverse: true,
    },
    {
      num: '03',
      name: 'Odaiba',
      kanji: 'お台場',
      body: 'Uma ilha artificial que sonha com o futuro. Construída sobre terra aterrada, Odaiba contempla Tokyo do outro lado da baía — a cidade refletida em sua própria ambição.',
      statValue: '448',
      statUnit: 'ha',
      statLabel:
        'Área aterrada — criada para defender, renascida para sonhar',
      img: 'Odaiba.webp',
      reverse: false,
    },
  ];

  constructor() {
    afterNextRender(() => this.initAnimations());
  }

  private initAnimations(): void {
    this.districtRows().forEach((ref) => {
      const el = ref.nativeElement;
      const textEl = el.querySelector('.district__text');

      if (textEl) {
        const tween = gsap.from(textEl, {
          opacity: 0,
          y: 70,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
          },
        });
        if (tween.scrollTrigger) {
          this.scrollTriggers.push(tween.scrollTrigger as unknown as globalThis.ScrollTrigger);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((t) => t.kill());
  }
}

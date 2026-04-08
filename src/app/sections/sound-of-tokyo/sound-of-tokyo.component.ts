import {
  Component,
  ElementRef,
  viewChildren,
  viewChild,
  afterNextRender,
  ChangeDetectionStrategy,
  OnDestroy,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SoundCard {
  id: string;
  label: string;
  labelJp: string;
  description: string;
  icon: string;
  file: string;
}

@Component({
  selector: 'app-sound-of-tokyo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sound-of-tokyo.component.html',
  styleUrl: './sound-of-tokyo.component.scss',
})
export class SoundOfTokyoComponent implements OnDestroy {
  private audioElements = new Map<string, HTMLAudioElement>();
  private scrollTriggers: globalThis.ScrollTrigger[] = [];
  isMobile = false;

  sectionEl = viewChild.required<ElementRef<HTMLElement>>('sectionEl');
  cardEls = viewChildren<ElementRef<HTMLElement>>('cardEl');

  activeCard = signal<string | null>(null);

  sounds: SoundCard[] = [
    {
      id: 'seven-eleven',
      label: 'Porta do Seven Eleven',
      labelJp: 'セブンイレブン',
      description: 'A melodia que recebe milhões todos os dias — o convite mais gentil de Tokyo.',
      icon: '店',
      file: 'seven-eleven-sound.mp3',
    },
    {
      id: 'subway',
      label: 'Estação de metrô',
      labelJp: '東京メトロ',
      description: 'O pulso subterrâneo da cidade — portas que abrem entre dois mundos.',
      icon: '駅',
      file: 'tokyo-subway.mp3',
    },
    {
      id: 'ginza',
      label: 'Cruzamento de Ginza',
      labelJp: '銀座の交差点',
      description: 'O alerta icônico que guia os invisíveis — o som da acessibilidade feita cultura.',
      icon: '街',
      file: 'crossing-alert.mp3',
    },
    {
      id: 'temple',
      label: 'Sino do templo',
      labelJp: '寺院の鐘',
      description: 'A ressonância grave que suspende o tempo entre duas respirações.',
      icon: '鐘',
      file: 'bell-temple.mp3',
    },
    {
      id: 'rain',
      label: 'Chuva em tokyo',
      labelJp: '谷中の雨',
      description: 'Gotas sobre telhas de barro — o som que Tokyo não consegue apagar.',
      icon: '雨',
      file: 'urban-rain-tokyo.mp3',
    },
    {
      id: 'train',
      label: 'Melodia da Yamanote',
      labelJp: '山手線の旋律',
      description: 'Cada estação, uma assinatura sonora no circuito infinito.',
      icon: '環',
      file:'yamanote-line.mp3'
    },
  ];

  constructor() {
    afterNextRender(() => {
      this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      this.preloadAudioElements();
      this.initScrollAnimations();
    });
  }

  /** Pre-create Audio elements so they're ready to play instantly */
  private preloadAudioElements(): void {
    for (const sound of this.sounds) {
      if (!sound.file) continue;
      const audio = new Audio(sound.file);
      audio.preload = 'auto';
      audio.volume = 0;
      audio.addEventListener('ended', () => {
        if (this.activeCard() === sound.id) {
          this.activeCard.set(null);
        }
      });
      this.audioElements.set(sound.id, audio);
    }
  }

  private initScrollAnimations(): void {
    const cards = this.cardEls().map((r) => r.nativeElement);

    const tween = gsap.from(cards, {
      opacity: 0,
      y: 48,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: this.sectionEl().nativeElement,
        start: 'top 75%',
      },
    });

    if (tween.scrollTrigger) {
      this.scrollTriggers.push(tween.scrollTrigger as unknown as globalThis.ScrollTrigger);
    }
  }

  onCardEnter(sound: SoundCard): void {
    this.activeCard.set(sound.id);
    this.playSound(sound);
  }

  onCardLeave(sound: SoundCard): void {
    this.activeCard.set(null);
    this.stopSound(sound.id);
  }

  onCardTap(event: Event, sound: SoundCard): void {
    event.preventDefault();

    // Toggle: tap again to stop
    if (this.activeCard() === sound.id) {
      this.activeCard.set(null);
      this.stopSound(sound.id);
      return;
    }

    // Stop any previous sound
    const prev = this.activeCard();
    if (prev) this.stopSound(prev);

    this.activeCard.set(sound.id);
    this.playSound(sound);
  }

  private playSound(sound: SoundCard): void {
    const audio = this.audioElements.get(sound.id);
    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = 0;
    audio.play().then(() => {
      this.fadeVolume(audio, 0, 0.6, 400);
    }).catch(() => {
      // Playback blocked — silently ignore
    });
  }

  private stopSound(id: string): void {
    const audio = this.audioElements.get(id);
    if (!audio || audio.paused) return;

    this.fadeVolume(audio, audio.volume, 0, 300, () => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /** Smooth volume fade using requestAnimationFrame */
  private fadeVolume(
    audio: HTMLAudioElement,
    from: number,
    to: number,
    durationMs: number,
    onDone?: () => void
  ): void {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      audio.volume = from + (to - from) * t;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };
    requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.audioElements.forEach((audio) => {
      audio.pause();
      audio.src = '';
    });
    this.audioElements.clear();
    this.scrollTriggers.forEach((st) => st.kill());
  }
}

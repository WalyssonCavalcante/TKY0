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
  frequency?: number;
  file?: string;
}

@Component({
  selector: 'app-sound-of-tokyo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sound-of-tokyo.component.html',
  styleUrl: './sound-of-tokyo.component.scss',
})
export class SoundOfTokyoComponent implements OnDestroy {
  private audioCtx: AudioContext | null = null;
  private activeOscillators = new Map<string, { osc: OscillatorNode; gain: GainNode }>();
  private activeSamples = new Map<string, { source: AudioBufferSourceNode; gain: GainNode }>();
  private audioBufferCache = new Map<string, AudioBuffer>();
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
      this.initScrollAnimations();
    });
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
    this.playTone(sound);
  }

  onCardLeave(sound: SoundCard): void {
    this.activeCard.set(null);
    this.stopTone(sound.id);
  }

  onCardTap(event: Event, sound: SoundCard): void {
    event.preventDefault();

    // Toggle: tap again to stop
    if (this.activeCard() === sound.id) {
      this.activeCard.set(null);
      this.stopTone(sound.id);
      return;
    }

    // Stop any previous sound
    const prev = this.activeCard();
    if (prev) this.stopTone(prev);

    // iOS Safari requires AudioContext creation/resume inside a user gesture
    this.ensureContext();

    this.activeCard.set(sound.id);
    this.playTone(sound);
  }

  private ensureContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private playTone(sound: SoundCard): void {
    if (sound.file) {
      this.playSample(sound);
      return;
    }
    if (this.activeOscillators.has(sound.id)) return;

    const ctx = this.ensureContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(sound.frequency!, ctx.currentTime);

    // Subtle detuned second oscillator for binaural depth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(sound.frequency! + 4, ctx.currentTime); // 4Hz binaural beat

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.6);

    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc.start();
    osc2.start();

    this.activeOscillators.set(sound.id, { osc, gain });
    this.activeOscillators.set(sound.id + '_b', { osc: osc2, gain: gain2 });
  }

  private async playSample(sound: SoundCard): Promise<void> {
    if (this.activeSamples.has(sound.id)) return;

    const ctx = this.ensureContext();
    let buffer = this.audioBufferCache.get(sound.file!);

    if (!buffer) {
      const response = await fetch(sound.file!);
      const arrayBuffer = await response.arrayBuffer();
      buffer = await ctx.decodeAudioData(arrayBuffer);
      this.audioBufferCache.set(sound.file!, buffer);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.6);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    this.activeSamples.set(sound.id, { source, gain });
  }

  private stopTone(id: string): void {
    // Stop sample-based audio
    const sample = this.activeSamples.get(id);
    if (sample) {
      const ctx = this.audioCtx!;
      sample.gain.gain.cancelScheduledValues(ctx.currentTime);
      sample.gain.gain.setValueAtTime(sample.gain.gain.value, ctx.currentTime);
      sample.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      sample.source.stop(ctx.currentTime + 0.5);
      this.activeSamples.delete(id);
      return;
    }

    // Stop oscillator-based audio
    [id, id + '_b'].forEach((key) => {
      const entry = this.activeOscillators.get(key);
      if (!entry) return;

      const { osc, gain } = entry;
      const ctx = this.audioCtx!;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      osc.stop(ctx.currentTime + 0.5);
      this.activeOscillators.delete(key);
    });
  }

  ngOnDestroy(): void {
    this.activeSamples.forEach(({ source }) => {
      try { source.stop(); } catch { /* already stopped */ }
    });
    this.activeSamples.clear();
    this.activeOscillators.forEach(({ osc }) => {
      try { osc.stop(); } catch { /* already stopped */ }
    });
    this.activeOscillators.clear();
    this.audioCtx?.close();
    this.scrollTriggers.forEach((st) => st.kill());
  }
}

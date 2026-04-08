import { Injectable, DestroyRef, inject } from '@angular/core';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class LenisService {
  private lenis!: Lenis;
  private destroyRef = inject(DestroyRef);

  init(): void {
    this.lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
    });

    // Lenis feeds ScrollTrigger on every scroll frame
    this.lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP ticker (time is in seconds → convert to ms)
    const tick = (time: number) => {
      this.lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    this.destroyRef.onDestroy(() => {
      gsap.ticker.remove(tick);
      this.lenis.destroy();
    });
  }

  get instance(): Lenis {
    return this.lenis;
  }
}

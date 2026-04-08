import {
  Component,
  ChangeDetectionStrategy,
  signal,
  afterNextRender,
  DestroyRef,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    class="scroll-progress"
    role="progressbar"
    [attr.aria-valuenow]="Math.round(progress() * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Progresso de leitura"
    [style.transform]="'scaleX(' + progress() + ')'"
  ></div>`,
  styles: `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-accent);
      transform-origin: left;
      transform: scaleX(0);
      z-index: 200;
      pointer-events: none;
      will-change: transform;
      transition: opacity 0.3s;
    }
  `,
})
export class ScrollProgressComponent {
  protected readonly Math = Math;
  progress = signal(0);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const onScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.progress.set(docHeight > 0 ? scrollTop / docHeight : 0);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }
}

import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  afterNextRender,
  DestroyRef,
} from '@angular/core';
import { LenisService } from '../../../core/lenis.service';
import { WeatherService } from '../../../core/weather.service';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  imports: [WeatherIconComponent],
})
export class NavComponent {
  private lenis = inject(LenisService);
  private destroyRef = inject(DestroyRef);
  protected weatherService = inject(WeatherService);

  isSolid = signal(false);
  menuOpen = signal(false);

  links = [
    { label: 'Filosofia', href: '#philosophy' },
    { label: 'Histórias', href: '#stories' },
    { label: 'Sons', href: '#sounds' },
    { label: 'Distritos', href: '#districts' },
    { label: 'Cultura', href: '#culture' },
  ];

  constructor() {
    afterNextRender(() => {
      const onScroll = () => this.isSolid.set(window.scrollY > 80);
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
      this.weatherService.fetch();
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  scrollTo(event: Event, href: string): void {
    event.preventDefault();
    this.menuOpen.set(false);
    document.body.style.overflow = '';
    this.lenis.instance.scrollTo(href, { offset: 0, duration: 1.4 });
  }
}

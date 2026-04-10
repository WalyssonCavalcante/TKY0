import {
  Component,
  signal,
  afterNextRender,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LenisService } from './core/lenis.service';
import { PreloaderComponent } from './shared/components/preloader/preloader.component';
import { NavComponent } from './shared/components/nav/nav.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ManifestoComponent } from './sections/manifesto/manifesto.component';
import { StoriesGridComponent } from './sections/stories-grid/stories-grid.component';
import { DistrictsComponent } from './sections/districts/districts.component';
import { MapSpreadComponent } from './sections/map-spread/map-spread.component';
import { FujisanComponent } from './sections/fujisan/fujisan.component';
import { HiddenAlleysComponent } from './sections/hidden-alleys/hidden-alleys.component';
import { StatsComponent } from './sections/stats/stats.component';
import { SoundOfTokyoComponent } from './sections/sound-of-tokyo/sound-of-tokyo.component';
import { FooterComponent } from './sections/footer/footer.component';
import { NoiseOverlayComponent } from './shared/components/noise-overlay/noise-overlay.component';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreloaderComponent,
    NavComponent,
    HeroComponent,
    ManifestoComponent,
    StoriesGridComponent,
    SoundOfTokyoComponent,
    DistrictsComponent,
    MapSpreadComponent,
    FujisanComponent,
    HiddenAlleysComponent,
    StatsComponent,
    FooterComponent,
    NoiseOverlayComponent,
    ScrollProgressComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private lenis = inject(LenisService);
  isLoaded = signal(false);

  constructor() {
    afterNextRender(() => this.lenis.init());
  }

  onLoaded(): void {
    this.isLoaded.set(true);
  }
}

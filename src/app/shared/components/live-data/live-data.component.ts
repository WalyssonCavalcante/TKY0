import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { WeatherService } from '../../../core/weather.service';
import { WeatherIconComponent } from '../weather-icon/weather-icon.component';

@Component({
  selector: 'app-live-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WeatherIconComponent],
  templateUrl: './live-data.component.html',
  styleUrl: './live-data.component.scss',
})
export class LiveDataComponent {
  protected weather = inject(WeatherService).weather;

  protected fujiStatus = computed(() => {
    const w = this.weather();
    if (!w) return null;
    return w.fujiVisible ? '富士山 visível' : '富士山 encoberto';
  });
}

import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import type { WeatherIcon } from '../../../core/weather.service';

@Component({
  selector: 'app-weather-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'weather-icon' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      width: 14px;
      height: 14px;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `,
  template: `
    @switch (icon()) {
      @case ('sun') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/><path d="M12 20v2"/>
          <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
          <path d="M2 12h2"/><path d="M20 12h2"/>
          <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      }
      @case ('cloud-sun') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/>
          <path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/>
          <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/>
          <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>
        </svg>
      }
      @case ('cloud') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
        </svg>
      }
      @case ('cloud-fog') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <path d="M16 17H7"/><path d="M17 21H9"/>
        </svg>
      }
      @case ('cloud-drizzle') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <path d="M8 19v1"/><path d="M8 14v1"/>
          <path d="M16 19v1"/><path d="M16 14v1"/>
          <path d="M12 21v1"/><path d="M12 16v1"/>
        </svg>
      }
      @case ('cloud-rain') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
        </svg>
      }
      @case ('snowflake') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/>
          <path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/>
          <path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/>
          <path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/>
          <path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/>
          <path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>
        </svg>
      }
      @case ('cloud-lightning') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/>
          <path d="m13 12-3 5h4l-3 5"/>
        </svg>
      }
    }
  `,
})
export class WeatherIconComponent {
  icon = input.required<WeatherIcon>();
}

import { Injectable, signal } from '@angular/core';

export type WeatherIcon =
  | 'sun'
  | 'cloud-sun'
  | 'cloud'
  | 'cloud-fog'
  | 'cloud-drizzle'
  | 'cloud-rain'
  | 'snowflake'
  | 'cloud-lightning';

export interface WeatherData {
  temp: number;
  icon: WeatherIcon;
  fujiVisible: boolean;
  humidity: number;
  windSpeed: number;
}

const WMO_ICON_MAP: Record<number, WeatherIcon> = {
  0: 'sun',
  1: 'cloud-sun', 2: 'cloud-sun', 3: 'cloud',
  45: 'cloud-fog', 48: 'cloud-fog',
  51: 'cloud-drizzle', 53: 'cloud-drizzle', 55: 'cloud-drizzle',
  61: 'cloud-rain', 63: 'cloud-rain', 65: 'cloud-rain',
  71: 'snowflake', 73: 'snowflake', 75: 'snowflake',
  80: 'cloud-drizzle', 81: 'cloud-rain', 82: 'cloud-rain',
  95: 'cloud-lightning', 96: 'cloud-lightning', 99: 'cloud-lightning',
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  weather = signal<WeatherData | null>(null);

  private readonly API_URL =
    'https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,cloud_cover,visibility&timezone=Asia/Tokyo';

  async fetch(): Promise<void> {
    try {
      const res = await fetch(this.API_URL);
      if (!res.ok) return;
      const data = await res.json();
      const current = data.current;
      const code = current.weather_code as number;
      const visibility = current.visibility as number; // meters
      const cloudCover = current.cloud_cover as number; // %

      // Fuji is ~100km from Tokyo — visible when sky is clear and visibility is high
      const fujiVisible = visibility >= 50_000 && cloudCover <= 40 && code <= 3;

      this.weather.set({
        temp: Math.round(current.temperature_2m),
        icon: WMO_ICON_MAP[code] ?? 'cloud',
        fujiVisible,
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
      });
    } catch {
      // Silently fail — tag falls back to static text
    }
  }
}

import { ApplicationConfig, provideZonelessChangeDetection, provideAppInitializer } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAppInitializer(() => gsap.registerPlugin(ScrollTrigger)),
  ]
};

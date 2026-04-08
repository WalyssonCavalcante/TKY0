import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-noise-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './noise-overlay.component.html',
  styleUrl: './noise-overlay.component.scss',
})
export class NoiseOverlayComponent {}

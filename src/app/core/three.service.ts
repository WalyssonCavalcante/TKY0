import { Injectable } from '@angular/core';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Points,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  AdditiveBlending,
  Color,
  Clock,
} from 'three';

@Injectable({ providedIn: 'root' })
export class ThreeService {
  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private particles!: Points;
  private animId!: number;
  private clock = new Clock();
  private isMobile = false;
  private resizeHandler = () => this.onResize();
  private visibilityHandler = () => this.onVisibilityChange();

  init(canvas: HTMLCanvasElement): void {
    this.isMobile = window.innerWidth <= 768;

    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !this.isMobile,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    const count = this.isMobile ? 1200 : 3000;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      scales[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new BufferAttribute(scales, 1));

    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 80 },
        uAccent: { value: new Color(0xd4956a) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        attribute float aScale;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(uTime * 0.5 + modelPosition.x * 0.8) * 0.08;
          modelPosition.x += cos(uTime * 0.3 + modelPosition.y * 0.6) * 0.05;

          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;

          gl_PointSize = uSize * aScale * uPixelRatio;
          gl_PointSize *= (1.0 / -viewPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uAccent;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.35, 0.5, dist);
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(uAccent, alpha * 0.6);
        }
      `,
    });

    this.particles = new Points(geometry, material);
    this.scene.add(this.particles);

    window.addEventListener('resize', this.resizeHandler);
    document.addEventListener('visibilitychange', this.visibilityHandler);

    this.animate();
  }

  private animate(): void {
    this.animId = requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();

    (this.particles.material as ShaderMaterial).uniforms['uTime'].value =
      elapsed;

    this.particles.rotation.y = elapsed * 0.02;
    this.particles.rotation.x = Math.sin(elapsed * 0.1) * 0.05;

    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onVisibilityChange(): void {
    if (document.hidden) {
      cancelAnimationFrame(this.animId);
      this.clock.stop();
    } else {
      this.clock.start();
      this.animate();
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.renderer.dispose();
  }
}

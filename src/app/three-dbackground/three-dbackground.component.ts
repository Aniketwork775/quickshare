import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-dbackground',
  templateUrl: './three-dbackground.component.html',
  styleUrls: ['./three-dbackground.component.scss']
})
export class ThreeDBackgroundComponent implements AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private balls: THREE.Mesh[] = [];
  private velocities: THREE.Vector3[] = [];
  private colors: number[] = [0xff5733, 0x33ff57, 0x3357ff, 0xf3ff33, 0xff33a8, 0x33fff5]; // Vibrant colors
  private theme: 'light' | 'dark' = 'light';

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initScene();
    this.createBalls();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.nativeElement.appendChild(this.renderer.domElement);
    this.camera.position.z = 15;

    // Add soft ambient light for a smooth round look
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);
  }

  createBalls() {
    const ballGeometry = new THREE.SphereGeometry(1, 64, 64); // High-segment sphere for smooth roundness

    for (let i = 0; i < 25; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const ballMaterial = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.3
      });

      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.set(Math.random() * 20 - 10, Math.random() * 10 - 5, Math.random() * 10 - 5);
      
      this.scene.add(ball);
      this.balls.push(ball);
      this.velocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2));
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    this.balls.forEach((ball, i) => {
      ball.position.add(this.velocities[i]);

      // Bounce effect
      if (ball.position.x > 10 || ball.position.x < -10) this.velocities[i].x *= -1;
      if (ball.position.y > 5 || ball.position.y < -5) this.velocities[i].y *= -1;
      if (ball.position.z > 5 || ball.position.z < -5) this.velocities[i].z *= -1;
    });

    this.renderer.render(this.scene, this.camera);
  };

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Change colors on theme switch
  changeTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    this.balls.forEach((ball) => {
      const newColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      (ball.material as THREE.MeshStandardMaterial).color.setHex(newColor);
    });
  }
}
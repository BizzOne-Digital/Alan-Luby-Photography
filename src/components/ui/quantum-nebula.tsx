import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * Quantum Nebula — GPU-simulated interactive particle field.
 *
 * The whole simulation (curl-noise advection + mouse repulsion) runs in the
 * vertex shader. Nothing is recomputed on the CPU per frame, so particle count
 * costs GPU fill rate only and the main thread stays free for the page.
 */

const config = {
  particles: {
    count: 50000,
    // Yields ~1.5-5px after the depth term; below ~0.5 the GPU clamps to 1px
    // and both aScale and the depth falloff stop having any effect.
    size: 1.0,
    boxSize: 5,
  },
  colors: {
    // 347 is the hue of the site accent #E11D48, so the field reads as brand.
    baseHue: 347,
    hueVariance: 24,
  },
  simulation: {
    noiseSpeed: 0.1,
    noiseScale: 1.2,
    flowAmplitude: 0.55,
    mouseRepulsion: 0.35,
    mouseRadius: 1.8,
  },
  bloom: {
    strength: 0.6,
    radius: 0.4,
    threshold: 0.1,
  },
  camera: {
    initialDistance: 5,
    parallaxIntensity: 0.45,
  },
} as const;

/** Ashima simplex noise + curl, injected into the vertex shader. */
const NOISE_GLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  vec3 snoiseVec3(vec3 x) {
    return vec3(
      snoise(x),
      snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
      snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
    );
  }

  /** Divergence-free field — particles swirl instead of clumping. */
  vec3 curlNoise(vec3 p) {
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    vec3 p_x0 = snoiseVec3(p - dx), p_x1 = snoiseVec3(p + dx);
    vec3 p_y0 = snoiseVec3(p - dy), p_y1 = snoiseVec3(p + dy);
    vec3 p_z0 = snoiseVec3(p - dz), p_z1 = snoiseVec3(p + dz);
    float cx = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float cy = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float cz = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    return normalize(vec3(cx, cy, cz) / (2.0 * e));
  }
`;

const VERTEX_SHADER = `
  attribute vec3 aColor;
  attribute float aScale;

  uniform float u_time;
  uniform float u_pointSize;
  uniform float u_noiseScale;
  uniform float u_flowAmplitude;
  uniform vec3  u_mouse;
  uniform float u_mouseRepulsion;
  uniform float u_mouseRadius;

  varying vec3 vColor;

${NOISE_GLSL}

  void main() {
    vColor = aColor;

    vec3 p = position;

    // Two octaves of curl flow: broad swirl plus finer filament detail.
    p += curlNoise(p * u_noiseScale + vec3(0.0, 0.0, u_time)) * u_flowAmplitude;
    p += curlNoise(p * u_noiseScale * 2.4 + vec3(u_time * 0.7)) * u_flowAmplitude * 0.3;

    // Push away from the cursor, falling off with distance.
    vec3 toMouse = p - u_mouse;
    float d = length(toMouse);
    if (d < u_mouseRadius) {
      float falloff = 1.0 - (d / u_mouseRadius);
      p += (toMouse / max(d, 0.001)) * falloff * falloff * u_mouseRepulsion;
    }

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = u_pointSize * aScale * (10.0 / max(-mvPosition.z, 0.001));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;

  void main() {
    // Soft radial falloff reads far better under bloom than a hard disc.
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - smoothstep(0.0, 0.5, d);
    if (strength < 0.01) discard;
    gl_FragColor = vec4(vColor, pow(strength, 1.5));
  }
`;

export interface QuantumNebulaProps {
  className?: string;
  /** Particle count. Runs on the GPU, so this is cheap to raise. */
  particleCount?: number;
  /** Hue in degrees. Defaults to the site accent (#E11D48). */
  baseHue?: number;
  hueVariance?: number;
  bloomStrength?: number;
  /** Set false to drop the cursor listeners. */
  interactive?: boolean;
  /** Scale the particle count down on small viewports. Set false to opt out. */
  adaptive?: boolean;
}

export function QuantumNebula({
  className = 'absolute inset-0 w-full h-full z-0',
  particleCount = config.particles.count,
  baseHue = config.colors.baseHue,
  hueVariance = config.colors.hueVariance,
  bloomStrength = config.bloom.strength,
  interactive = true,
  adaptive = true,
}: QuantumNebulaProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Phone GPUs choke on 50k points plus the bloom passes, so thin the field out.
    const isSmallViewport = window.matchMedia('(max-width: 768px)').matches;
    const count =
      adaptive && isSmallViewport ? Math.round(particleCount * 0.35) : particleCount;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      1000,
    );
    camera.position.z = config.camera.initialDistance;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    // Cap DPR: fill rate is the bottleneck and 3x displays gain nothing visible.
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(mount.clientWidth, mount.clientHeight),
        bloomStrength,
        config.bloom.radius,
        config.bloom.threshold,
      ),
    );

    // --- Particle buffers (built once) ---
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const color = new THREE.Color();
    const { boxSize } = config.particles;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * boxSize;
      positions[i3 + 1] = (Math.random() - 0.5) * boxSize;
      positions[i3 + 2] = (Math.random() - 0.5) * boxSize;

      const hue = (baseHue + (Math.random() - 0.5) * hueVariance) / 360;
      color.setHSL(hue, 1.0, 0.45 + Math.random() * 0.2);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      scales[i] = 0.5 + Math.random() * 1.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_pointSize: { value: config.particles.size * pixelRatio },
        u_noiseScale: { value: config.simulation.noiseScale },
        u_flowAmplitude: { value: config.simulation.flowAmplitude },
        u_mouse: { value: new THREE.Vector3(1e3, 1e3, 1e3) },
        u_mouseRepulsion: { value: config.simulation.mouseRepulsion },
        u_mouseRadius: { value: config.simulation.mouseRadius },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Loop ---
    const startTime = performance.now();
    let frameId = 0;
    let visible = true;

    const render = () => {
      if (!prefersReducedMotion) {
        const elapsed = (performance.now() - startTime) / 1000;
        material.uniforms.u_time.value = elapsed * config.simulation.noiseSpeed;

        const halfBox = boxSize / 2;
        material.uniforms.u_mouse.value.set(
          mouseRef.current.x * halfBox,
          mouseRef.current.y * halfBox,
          0,
        );

        const { parallaxIntensity } = config.camera;
        camera.position.x +=
          (mouseRef.current.x * parallaxIntensity - camera.position.x) * 0.02;
        camera.position.y +=
          (mouseRef.current.y * parallaxIntensity - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
      }

      composer.render();
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (visible) render();
    };
    animate();

    // --- Observers & listeners ---
    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    });
    resizeObserver.observe(mount);

    // Stop burning GPU once the hero scrolls out of view.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(mount);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (interactive && !prefersReducedMotion) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    // Render one frame so reduced-motion users still get the static field.
    if (prefersReducedMotion) render();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);

      geometry.dispose();
      material.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [particleCount, baseHue, hueVariance, bloomStrength, interactive, adaptive]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}

export default QuantumNebula;

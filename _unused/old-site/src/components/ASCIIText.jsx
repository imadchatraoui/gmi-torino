// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

Math.map = function (n, start, stop, start2, stop2) {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
};

class AsciiFilter {
  constructor(renderer, { fontSize, fontFamily, charset, invert } = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';
    this.domElement.style.overflow = 'hidden';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    // willReadFrequently optimizes getImageData readbacks and eliminates GPU stall warnings
    this.context = this.canvas.getContext('2d', { willReadFrequently: true });
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset = charset ?? ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

    if (this.context) {
      this.context.webkitImageSmoothingEnabled = false;
      this.context.mozImageSmoothingEnabled = false;
      this.context.msImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;
    }

    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('touchmove', this.onMouseMove, { passive: true });
    window.addEventListener('touchstart', this.onMouseMove, { passive: true });
  }

  measureCharWidth() {
    if (!this.context) return this.fontSize * 0.6;
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const sample = 'A'.repeat(100);
    const metrics = this.context.measureText(sample);
    if (metrics && metrics.width > 0) {
      return metrics.width / 100;
    }
    return this.fontSize * 0.6;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();

    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    this.charWidth = this.measureCharWidth();
    this.charHeight = this.fontSize;

    this.cols = Math.max(1, Math.floor(this.width / this.charWidth));
    this.rows = Math.max(1, Math.floor(this.height / this.charHeight));

    // Internal canvas resolution strictly matches character grid
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;

    // Physical display dimensions of the grid
    const gridWidth = this.cols * this.charWidth;
    const gridHeight = this.rows * this.charHeight;

    // Center the character grid and canvas together inside the container
    const offsetX = Math.max(0, (this.width - gridWidth) / 2);
    const offsetY = Math.max(0, (this.height - gridHeight) / 2);

    // Lock canvas position and size to exact grid dimensions
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = `${offsetX}px`;
    this.canvas.style.top = `${offsetY}px`;
    this.canvas.style.width = `${gridWidth}px`;
    this.canvas.style.height = `${gridHeight}px`;

    // Lock <pre> to exact same pixel dimensions and position
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.lineHeight = `${this.charHeight}px`;
    this.pre.style.letterSpacing = '0px';
    this.pre.style.wordSpacing = '0px';
    this.pre.style.fontVariantLigatures = 'none';
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.position = 'absolute';
    this.pre.style.left = `${offsetX}px`;
    this.pre.style.top = `${offsetY}px`;
    this.pre.style.width = `${gridWidth}px`;
    this.pre.style.height = `${gridHeight}px`;
    this.pre.style.overflow = 'hidden';
    this.pre.style.zIndex = '9';
    // Use scroll attachment so background gradient stays locked to element on mobile
    this.pre.style.backgroundAttachment = 'scroll';
    this.pre.style.mixBlendMode = 'difference';
    this.pre.style.webkitTextSizeAdjust = 'none';
    this.pre.style.textSizeAdjust = 'none';
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);

    const w = this.canvas.width;
    const h = this.canvas.height;
    if (this.context && w > 0 && h > 0) {
      this.context.clearRect(0, 0, w, h);
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
      this.asciify(this.context, w, h);
    }

    this.hue();
  }

  onMouseMove(e) {
    const evt = e.touches ? e.touches[0] : e;
    if (!evt) return;
    const bounds = this.domElement.getBoundingClientRect();
    this.mouse = {
      x: evt.clientX - bounds.left,
      y: evt.clientY - bounds.top
    };
  }

  get dx() {
    return (this.mouse ? this.mouse.x : this.center.x) - this.center.x;
  }

  get dy() {
    return (this.mouse ? this.mouse.y : this.center.y) - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx, w, h) {
    if (w && h) {
      const imgData = ctx.getImageData(0, 0, w, h).data;
      let str = '';
      const charset = this.charset;
      const charsetLen = charset.length;
      const invert = this.invert;

      for (let y = 0; y < h; y++) {
        const rowOffset = y * 4 * w;
        for (let x = 0; x < w; x++) {
          const i = rowOffset + x * 4;
          const a = imgData[i + 3];

          if (a === 0) {
            str += ' ';
            continue;
          }

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          const gray = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
          let idx = Math.floor((1 - gray) * (charsetLen - 1));
          if (invert) idx = charsetLen - 1 - idx;
          str += charset[idx] || ' ';
        }
        str += '\n';
      }
      // textContent is substantially faster and avoids HTML entity bugs
      this.pre.textContent = str;
    }
  }

  dispose() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchmove', this.onMouseMove);
    window.removeEventListener('touchstart', this.onMouseMove);
  }
}

class CanvasTxt {
  constructor(txt, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;

    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);

    const textWidth = Math.ceil(metrics.width) + 20;
    const textHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;

    this.canvas.width = textWidth;
    this.canvas.height = textHeight;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;

    const metrics = this.context.measureText(this.txt);
    const yPos = 10 + metrics.actualBoundingBoxAscent;

    this.context.fillText(this.txt, 10, yPos);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

class CanvAscii {
  constructor(
    { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
    containerElem,
    width,
    height
  ) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 30;

    this.scene = new THREE.Scene();
    this.mouse = { x: this.width / 2, y: this.height / 2 };

    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async init() {
    try {
      await document.fonts.load(`600 ${this.textFontSize}px "IBM Plex Mono"`);
      await document.fonts.load(`500 ${this.asciiFontSize}px "IBM Plex Mono"`);
    } catch {
      // Font loading failed, continue with fallback
    }
    await document.fonts.ready;

    this.setMesh();
    this.setRenderer();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (this.filter && this.width > 0 && this.height > 0) {
          this.setSize(this.width, this.height);
        }
      });
    }
  }

  calculatePlaneSize() {
    const textAspect = (this.textCanvas.width || 1) / (this.textCanvas.height || 1);
    const vFov = (this.camera.fov * Math.PI) / 180;
    const visibleH = 2 * Math.tan(vFov / 2) * this.camera.position.z;
    const visibleW = visibleH * (this.width / this.height);

    // On mobile portrait screens, fit plane within 85% of visible viewport width
    const maxPlaneW = visibleW * 0.85;
    const effectiveBaseH = Math.min(this.planeBaseHeight, maxPlaneW / textAspect);

    return {
      planeW: effectiveBaseH * textAspect,
      planeH: effectiveBaseH
    };
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: 'IBM Plex Mono',
      color: this.textColor
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    const { planeW, planeH } = this.calculatePlaneSize();

    const isMobile = window.innerWidth <= 768;
    const segments = isMobile ? 18 : 36;
    this.geometry = new THREE.PlaneGeometry(planeW, planeH, segments, segments);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 }
      }
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  updateMeshDimensions() {
    if (!this.mesh || !this.textCanvas) return;
    const { planeW, planeH } = this.calculatePlaneSize();
    if (this.geometry) {
      this.geometry.dispose();
    }
    const isMobile = window.innerWidth <= 768;
    const segments = isMobile ? 18 : 36;
    this.geometry = new THREE.PlaneGeometry(planeW, planeH, segments, segments);
    this.mesh.geometry = this.geometry;
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'IBM Plex Mono',
      fontSize: this.asciiFontSize,
      invert: true
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('touchmove', this.onMouseMove, { passive: true });
    window.addEventListener('touchstart', this.onMouseMove, { passive: true });
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.updateMeshDimensions();
    this.filter.setSize(w, h);

    this.center = { x: w / 2, y: h / 2 };
  }

  load() {
    this.animate();
  }

  onMouseMove(evt) {
    const e = evt.touches ? evt.touches[0] : evt;
    if (!e) return;
    const bounds = this.container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    this.mouse = { x, y };
  }

  animate() {
    // Initialize visibility observer if not present
    if (this.isVisible === undefined) {
      this.isVisible = true;
      try {
        this.visObserver = new IntersectionObserver(([entry]) => {
          this.isVisible = entry.isIntersecting;
        });
        if (this.container) this.visObserver.observe(this.container);
      } catch (e) {}
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches || /Mobi|Android/i.test(navigator.userAgent);
    const fpsLimit = isMobile ? 30 : 60;
    const interval = 1000 / fpsLimit;
    let lastTime = 0;
    const animateFrame = (now) => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      if (!this.isVisible || this.isPaused || now - lastTime < interval) return;
      lastTime = now;
      this.render();
    };
    this.animationFrameId = requestAnimationFrame(animateFrame);
  }

  render() {
    const time = performance.now() * 0.001;

    this.textCanvas.render();
    this.texture.needsUpdate = true;

    this.mesh.material.uniforms.uTime.value = Math.sin(time);

    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    const x = Math.map(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = Math.map(this.mouse.x, 0, this.width, -0.5, 0.5);

    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
  }

  clear() {
    this.scene.traverse(obj => {
      if (obj.isMesh && typeof obj.material === 'object' && obj.material !== null) {
        Object.keys(obj.material).forEach(key => {
          const matProp = obj.material[key];
          if (matProp !== null && typeof matProp === 'object' && typeof matProp.dispose === 'function') {
            matProp.dispose();
          }
        });
        obj.material.dispose();
        obj.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.filter) {
      this.filter.dispose();
      if (this.filter.domElement.parentNode) {
        this.container.removeChild(this.filter.domElement);
      }
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchmove', this.onMouseMove);
    window.removeEventListener('touchstart', this.onMouseMove);
    this.clear();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}

export default function ASCIIText({
  text = 'David!',
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = '#fdf9f3',
  planeBaseHeight = 8,
  enableWaves = true,
  paused = false
}) {
  const containerRef = useRef(null);
  const asciiRef = useRef(null);

  useEffect(() => {
    if (asciiRef.current) {
      asciiRef.current.isPaused = paused;
    }
  }, [paused]);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let observer = null;
    let ro = null;
    let resizeTimeout = null;

    let lastW = 0;
    let lastH = 0;

    const effectiveAsciiSize = window.innerWidth < 400 && asciiFontSize < 10 ? 11 : asciiFontSize;

    const createAndInit = async (container, w, h) => {
      const instance = new CanvAscii(
        { text, asciiFontSize: effectiveAsciiSize, textFontSize, textColor, planeBaseHeight, enableWaves },
        container,
        w,
        h
      );
      await instance.init();
      return instance;
    };

    const attachResizeObserver = () => {
      ro = new ResizeObserver(entries => {
        if (!entries[0] || !asciiRef.current) return;
        const { width: w, height: h } = entries[0].contentRect;
        if (w <= 0 || h <= 0) return;

        const wDiff = Math.abs(w - lastW);
        const hDiff = Math.abs(h - lastH);

        // Substantial width change: desktop window resize or mobile orientation flip
        if (wDiff > 2) {
          lastW = w;
          lastH = h;
          clearTimeout(resizeTimeout);
          asciiRef.current.setSize(w, h);
          return;
        }

        // On mobile devices, scrolling expands/collapses the dynamic URL address bar,
        // causing height to shift by ~40-100px while width is strictly identical.
        // We explicitly ignore these minor height fluctuations to prevent re-gridding and visual jumping!
        if (hDiff > 160) {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            if (!cancelled && asciiRef.current) {
              lastH = h;
              asciiRef.current.setSize(w, h);
            }
          }, 150);
        }
      });
      ro.observe(containerRef.current);
    };

    const setup = async () => {
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        observer = new IntersectionObserver(
          async ([entry]) => {
            if (cancelled) return;
            if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {
              const { width: w, height: h } = entry.boundingClientRect;
              observer.disconnect();
              observer = null;

              if (!cancelled) {
                lastW = w;
                lastH = h;
                asciiRef.current = await createAndInit(containerRef.current, w, h);
                if (!cancelled && asciiRef.current) {
                  asciiRef.current.load();
                  attachResizeObserver();
                }
              }
            }
          },
          { threshold: 0.05 }
        );
        observer.observe(containerRef.current);
        return;
      }

      lastW = width;
      lastH = height;
      asciiRef.current = await createAndInit(containerRef.current, width, height);
      if (!cancelled && asciiRef.current) {
        asciiRef.current.load();
        attachResizeObserver();
      }
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        if (!cancelled && containerRef.current && asciiRef.current) {
          const r = containerRef.current.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            lastW = r.width;
            lastH = r.height;
            asciiRef.current.setSize(r.width, r.height);
          }
        }
      }, 150);
    };

    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    setup();

    return () => {
      cancelled = true;
      clearTimeout(resizeTimeout);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (observer) observer.disconnect();
      if (ro) ro.disconnect();
      if (asciiRef.current) {
        asciiRef.current.dispose();
        asciiRef.current = null;
      }
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return (
    <div
      ref={containerRef}
      className="ascii-text-container"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap');

        .ascii-text-container {
          overflow: hidden;
          touch-action: none;
        }

        .ascii-text-container canvas {
          position: absolute;
          image-rendering: optimizeSpeed;
          image-rendering: -moz-crisp-edges;
          image-rendering: -o-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
          pointer-events: none;
        }

        .ascii-text-container pre {
          margin: 0;
          user-select: none;
          padding: 0;
          text-align: left;
          position: absolute;
          background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);
          background-size: 100% 100%;
          background-position: center;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          z-index: 9;
          mix-blend-mode: difference;
          -webkit-text-size-adjust: none;
          text-size-adjust: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          touch-action: none;
          pointer-events: none;
          white-space: pre;
        }

        /* Invert colors after rendering the effect if in light mode */
        :root[data-theme='light'] .ascii-text-container {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
}

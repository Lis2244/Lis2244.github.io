import * as THREE from 'three';

// Обработка ошибок для Яндекс Браузера
window.addEventListener('error', (e) => {
  console.warn('Ошибка загрузки:', e.message);
});

// ====== ИНИЦИАЛИЗАЦИЯ ======
let container, scene, camera, renderer, particles, stars, clock;

function init() {
  container = document.getElementById('canvas-container');
  if (!container) {
    console.error('Canvas container not found');
    return;
  }
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0c);
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.02);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 18);

  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  createParticles();
  createStars();
  
  clock = new THREE.Clock();
  animate();
  
  // Добавляем обработчики событий
  setupEventListeners();
}

function createParticles() {
  const particlesCount = 6000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  const sphereRadius = 5;
  for (let i = 0; i < particlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = sphereRadius + (Math.random() - 0.5) * 0.5;

    const x = Math.sin(phi) * Math.cos(theta) * r;
    const y = Math.sin(phi) * Math.sin(theta) * r;
    const z = Math.cos(phi) * r;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const normalizedY = (y + sphereRadius) / (sphereRadius * 2);

    if (normalizedY > 0.66) {
      colors[i * 3] = 0.95;
      colors[i * 3 + 1] = 0.95;
      colors[i * 3 + 2] = 0.95;
    } else if (normalizedY > 0.33) {
      colors[i * 3] = 0.2;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = 0.9;
    } else {
      colors[i * 3] = 0.9;
      colors[i * 3 + 1] = 0.2;
      colors[i * 3 + 2] = 0.2;
    }

    sizes[i] = 0.7 + Math.random() * 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    attribute vec3 color;
    attribute float size;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = color;

      vec3 pos = position;

      float rotation = uScroll * 3.14159 * 2.0;
      float cosR = cos(rotation);
      float sinR = sin(rotation);

      float x = pos.x * cosR - pos.z * sinR;
      float z = pos.x * sinR + pos.z * cosR;
      pos.x = x;
      pos.z = z;

      pos.x += sin(uTime * 0.5 + pos.y * 0.3) * 0.1;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      gl_PointSize = size * 120.0 / -mvPosition.z;

      vAlpha = 0.75 + 0.25 * sin(uTime * 2.0 + pos.x);
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);

      float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
      alpha *= vAlpha;

      float glow = 1.0 - dist * 2.0;
      glow = pow(max(glow, 0.0), 1.2);
      vec3 finalColor = vColor * (1.0 + glow * 0.4);

      gl_FragColor = vec4(finalColor, alpha * 0.9);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(1000 * 3);
  for (let i = 0; i < 1000 * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 50;
    starPositions[i + 1] = (Math.random() - 0.5) * 50;
    starPositions[i + 2] = (Math.random() - 0.5) * 50 - 20;
  }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

let scrollProgress = 0;
let targetScroll = 0;

function setupEventListeners() {
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = winScroll / height;
  });
  
  window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  // Progress bar
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';
  });
  
  // Intersection Observer
  const sections = document.querySelectorAll('section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));
  } else {
    sections.forEach(section => section.classList.add('visible'));
  }
  
  // Copy functionality
  document.querySelectorAll('.copyable').forEach(el => {
    el.addEventListener('click', function() {
      const text = this.dataset.copy || this.textContent.trim();
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast('Скопировано'));
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Скопировано');
      }
    });
  });
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
window.showToast = showToast;

window.downloadDocument = function(path, name) {
  try {
    const link = document.createElement('a');
    link.href = path;
    link.download = path.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Скачивание: ${name}`);
  } catch { showToast('Ошибка'); }
}

window.downloadAllDocuments = function() {
  const docs = [
    { path: 'docs/Ust.pdf', name: 'Устав фонда' }, 
    { path: 'docs/Svo_reg.pdf', name: 'Свидетельство о регистрации' }, 
    { path: 'docs/Bp_active.pdf', name: 'БП активная молодёжь' }, 
    { path: 'docs/Bukra.pdf', name: 'Вместе ради завтрашнего будущего' }, 
    { path: 'docs/BP.pdf', name: 'БП Помощь Войну' } 
  ];
  showToast('Загрузка...');
  docs.forEach((doc, i) => setTimeout(() => downloadDocument(doc.path, doc.name), i * 300));
}

function animate() {
  requestAnimationFrame(animate);
  
  if (!particles || !camera || !renderer) return;
  
  const elapsedTime = clock.getElapsedTime();
  
  scrollProgress += (targetScroll - scrollProgress) * 0.05;
  
  particles.material.uniforms.uTime.value = elapsedTime;
  particles.material.uniforms.uScroll.value = scrollProgress;
  
  const targetZ = 18 - scrollProgress * 6;
  camera.position.z += (targetZ - camera.position.z) * 0.05;
  
  if (stars) stars.rotation.y += 0.0002;
  
  renderer.render(scene, camera);
}

// Запускаем инициализацию после полной загрузки страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
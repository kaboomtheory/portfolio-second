<script setup lang="ts">
import type GUI from 'lil-gui'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement>()
const { isDark } = useTheme()

type SitePresetName = 'Site Light' | 'Site Dark'

const lightPreset = {
  color1: '#b8d4e8',
  color2: '#d0e4f4',
  color3: '#e8f0f8',
  color4: '#ffffff',
}

const darkPreset = {
  color1: '#040812',
  color2: '#060c1a',
  color3: '#80abe6',
  color4: '#030710',
}

const sharedParams = {
  depth: 0.2325,
  lightX: -1.008,
  lightY: 2,
  speed: 0.0252,
  angle: -2.43787589918568,
  foldFrequency: 1.975,
  warpAmount: 3.008,
  noiseScale: 0.927,
  connections: 1.5,
  shadowWidth: 0.11335,
}

/** Live shader + palette; kept in sync with uniforms and optional dev GUI */
const organicTweaks = {
  preset: 'Site Light' as SitePresetName,
  color1: lightPreset.color1,
  color2: lightPreset.color2,
  color3: lightPreset.color3,
  color4: lightPreset.color4,
  depth: sharedParams.depth,
  lightX: sharedParams.lightX,
  lightY: sharedParams.lightY,
  speed: sharedParams.speed,
  angle: sharedParams.angle,
  foldFrequency: sharedParams.foldFrequency,
  warpAmount: sharedParams.warpAmount,
  noiseScale: sharedParams.noiseScale,
  connections: sharedParams.connections,
  shadowWidth: sharedParams.shadowWidth,
}

function syncOrganicTweaksColorsFromTheme() {
  const p = isDark.value ? darkPreset : lightPreset
  organicTweaks.preset = isDark.value ? 'Site Dark' : 'Site Light'
  organicTweaks.color1 = p.color1
  organicTweaks.color2 = p.color2
  organicTweaks.color3 = p.color3
  organicTweaks.color4 = p.color4
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;

  uniform vec3 uLightPos;
  uniform float uDepth;

  uniform float uSpeed;
  uniform float uNoiseScale;
  uniform float uWarpAmount;
  uniform float uFoldFrequency;
  uniform float uAngle;
  uniform float uConnections;
  uniform float uShadowWidth;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
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
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float getSurface(vec2 p) {
    float c = cos(uAngle), s = sin(uAngle);
    mat2 rot = mat2(c, -s, s, c);
    vec2 rp = rot * p;

    float n1 = snoise(vec3(rp * uNoiseScale * 0.25, uTime * uSpeed * 0.7));
    float n2 = snoise(vec3(rp * uNoiseScale * 0.25 + vec2(21.4, 15.2), uTime * uSpeed * 0.9));

    float trig1 = sin(rp.x * uNoiseScale * 0.5 + uTime * uSpeed) * 0.3;
    float trig2 = cos(rp.y * uNoiseScale * 0.5 - uTime * uSpeed) * 0.3;

    vec2 flow = vec2(n1 + trig1, n2 + trig2);
    vec2 wp = rp + flow * (uWarpAmount * 0.12);

    float freq = uFoldFrequency * 0.5;
    float phase = sin(wp.y * freq + flow.y * 2.0) * uConnections;
    float mainWave = sin(wp.x * freq + phase * uWarpAmount * 0.3);

    float n3 = snoise(vec3(wp * 0.5, uTime * uSpeed * 0.5));

    return (mainWave * 0.85 + n3 * 0.15) * 0.5;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    vec2 e = vec2(0.09, 0.0);
    float dx = (getSurface(p + e.xy) - getSurface(p - e.xy)) / (2.0 * e.x);
    float dy = (getSurface(p + e.yx) - getSurface(p - e.yx)) / (2.0 * e.x);

    float safeDepth = max(uDepth, 0.02);
    vec3 normal = normalize(vec3(-dx, -dy, safeDepth));

    vec3 lightDir = normalize(uLightPos);
    float diffuse = dot(normal, lightDir) * 0.5 + 0.5;

    float t = diffuse;
    t += getSurface(p) * 0.04;
    t = clamp(t, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 color = mix(uColor1, uColor2, smoothstep(0.0, uShadowWidth + 0.15, t));
    color = mix(color, uColor3, smoothstep(uShadowWidth + 0.05, 0.65, t));
    color = mix(color, uColor4, smoothstep(0.55, 1.05, t));

    float grain = fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.03;

    gl_FragColor = vec4(color, 1.0);
  }
`

let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let geometry: THREE.PlaneGeometry | null = null
let scene: THREE.Scene | null = null
let camera: THREE.OrthographicCamera | null = null
let animationId: number | null = null

/** Lower = fewer shaded pixels (stretched by CSS). Biggest perf win for this shader. */
const INTERNAL_RES_SCALE = 0.55
const MAX_DPR = 1.25

let isPageVisible = true
let prefersReducedMotion = false
let resizeHandler: (() => void) | null = null
let visibilityHandler: (() => void) | null = null
let reducedMotionMql: MediaQueryList | null = null
let reducedMotionHandler: ((e: MediaQueryListEvent) => void) | null = null
let organicGui: GUI | null = null
let componentDisposed = false

function stopAnimationLoop() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

function syncRendererSize() {
  if (!renderer) return
  const canvas = renderer.domElement
  const pr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  const w = Math.max(1, Math.floor(window.innerWidth * INTERNAL_RES_SCALE * pr))
  const h = Math.max(1, Math.floor(window.innerHeight * INTERNAL_RES_SCALE * pr))
  renderer.setPixelRatio(1)
  renderer.setSize(w, h, false)
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  material?.uniforms.uResolution?.value.set(w, h)
}

function renderFrame() {
  if (!material || !renderer || !scene || !camera) return
  renderer.render(scene, camera)
}

/** Matches theme CSS / view transition duration */
const COLOR_BLEND_SEC = 0.65

const colorBlend = {
  t: 1,
  from: [
    new THREE.Color(),
    new THREE.Color(),
    new THREE.Color(),
    new THREE.Color(),
  ],
  to: [
    new THREE.Color(),
    new THREE.Color(),
    new THREE.Color(),
    new THREE.Color(),
  ],
}

let pendingPreset: typeof lightPreset | null = null

const colorUniformKeys = ['uColor1', 'uColor2', 'uColor3', 'uColor4'] as const

function refreshOrganicGuiDisplay() {
  organicGui?.controllersRecursive().forEach((c) => c.updateDisplay())
}

function applyTweaksToUniforms() {
  if (!material) return
  material.uniforms.uSpeed!.value = prefersReducedMotion ? 0 : organicTweaks.speed
  material.uniforms.uNoiseScale!.value = organicTweaks.noiseScale
  material.uniforms.uWarpAmount!.value = organicTweaks.warpAmount
  material.uniforms.uAngle!.value = organicTweaks.angle
  material.uniforms.uFoldFrequency!.value = organicTweaks.foldFrequency
  material.uniforms.uDepth!.value = organicTweaks.depth
  material.uniforms.uConnections!.value = organicTweaks.connections
  material.uniforms.uShadowWidth!.value = organicTweaks.shadowWidth
  material.uniforms.uLightPos!.value.set(organicTweaks.lightX, organicTweaks.lightY, 1.0)
  renderFrame()
}

function applyTweaksColorsToMaterial() {
  if (!material) return
  colorBlend.t = 1
  material.uniforms.uColor1!.value.set(organicTweaks.color1)
  material.uniforms.uColor2!.value.set(organicTweaks.color2)
  material.uniforms.uColor3!.value.set(organicTweaks.color3)
  material.uniforms.uColor4!.value.set(organicTweaks.color4)
  renderFrame()
}

function applyPreset(preset: { color1: string; color2: string; color3: string; color4: string }) {
  if (!material) return
  organicTweaks.color1 = preset.color1
  organicTweaks.color2 = preset.color2
  organicTweaks.color3 = preset.color3
  organicTweaks.color4 = preset.color4
  material.uniforms.uColor1!.value.set(preset.color1)
  material.uniforms.uColor2!.value.set(preset.color2)
  material.uniforms.uColor3!.value.set(preset.color3)
  material.uniforms.uColor4!.value.set(preset.color4)
  refreshOrganicGuiDisplay()
}

function startColorBlend(preset: typeof lightPreset) {
  if (!material) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyPreset(preset)
    colorBlend.t = 1
    return
  }
  for (let i = 0; i < 4; i++) {
    const key = colorUniformKeys[i]!
    colorBlend.from[i]!.copy(material.uniforms[key]!.value)
    colorBlend.to[i]!.set(preset[`color${i + 1}` as 'color1'])
  }
  colorBlend.t = 0
}

watch(isDark, (dark) => {
  const preset = dark ? darkPreset : lightPreset
  syncOrganicTweaksColorsFromTheme()
  refreshOrganicGuiDisplay()
  if (!material) {
    pendingPreset = preset
    return
  }
  pendingPreset = null
  startColorBlend(preset)
})

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  componentDisposed = false
  syncOrganicTweaksColorsFromTheme()

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 1

  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  isPageVisible = !document.hidden

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'low-power',
    alpha: false,
  })

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: new THREE.Color(organicTweaks.color1) },
      uColor2: { value: new THREE.Color(organicTweaks.color2) },
      uColor3: { value: new THREE.Color(organicTweaks.color3) },
      uColor4: { value: new THREE.Color(organicTweaks.color4) },
      uDepth: { value: organicTweaks.depth },
      uLightPos: { value: new THREE.Vector3(organicTweaks.lightX, organicTweaks.lightY, 1.0) },
      uSpeed: { value: organicTweaks.speed },
      uNoiseScale: { value: organicTweaks.noiseScale },
      uWarpAmount: { value: organicTweaks.warpAmount },
      uFoldFrequency: { value: organicTweaks.foldFrequency },
      uAngle: { value: organicTweaks.angle },
      uConnections: { value: organicTweaks.connections },
      uShadowWidth: { value: organicTweaks.shadowWidth },
    },
  })

  syncRendererSize()

  if (prefersReducedMotion) {
    material.uniforms.uSpeed!.value = 0
  }

  reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotionHandler = (e: MediaQueryListEvent) => {
    prefersReducedMotion = e.matches
    if (!material) return
    material.uniforms.uSpeed!.value = e.matches ? 0 : organicTweaks.speed
    if (e.matches) {
      stopAnimationLoop()
      renderFrame()
    } else if (isPageVisible) {
      startAnimationLoop()
    }
  }
  reducedMotionMql.addEventListener('change', reducedMotionHandler)

  geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  if (pendingPreset) {
    startColorBlend(pendingPreset)
    pendingPreset = null
  }

  resizeHandler = () => {
    syncRendererSize()
    renderFrame()
  }
  window.addEventListener('resize', resizeHandler)

  visibilityHandler = () => {
    isPageVisible = !document.hidden
    if (!isPageVisible) {
      stopAnimationLoop()
      return
    }
    if (!prefersReducedMotion) {
      startAnimationLoop()
    } else {
      renderFrame()
    }
  }
  document.addEventListener('visibilitychange', visibilityHandler)

  const clock = new THREE.Clock()

  const tick = () => {
    if (!isPageVisible || !material || !renderer || !scene || !camera) return
    const dt = clock.getDelta()
    material.uniforms.uTime!.value = clock.elapsedTime
    if (colorBlend.t < 1) {
      colorBlend.t = Math.min(1, colorBlend.t + dt / COLOR_BLEND_SEC)
      const e = 1 - (1 - colorBlend.t) ** 3
      for (let i = 0; i < 4; i++) {
        const key = colorUniformKeys[i]!
        const u = material.uniforms[key]!.value
        u.copy(colorBlend.from[i]!).lerp(colorBlend.to[i]!, e)
      }
    }
    renderer.render(scene, camera)
  }

  function startAnimationLoop() {
    if (prefersReducedMotion) return
    stopAnimationLoop()
    const loop = () => {
      animationId = requestAnimationFrame(loop)
      tick()
    }
    animationId = requestAnimationFrame(loop)
  }

  if (prefersReducedMotion) {
    clock.getDelta()
    renderFrame()
  } else if (isPageVisible) {
    startAnimationLoop()
  }

  if (import.meta.dev) {
    void import('lil-gui').then(({ default: GUI }) => {
      if (componentDisposed || !material) return
      const gui = new GUI({ title: 'Organic Settings' })
      gui.close()

      gui
        .add(organicTweaks, 'preset', ['Site Light', 'Site Dark'])
        .name('Theme Preset')
        .onChange((name: SitePresetName) => {
          const p = name === 'Site Light' ? lightPreset : darkPreset
          organicTweaks.preset = name
          organicTweaks.color1 = p.color1
          organicTweaks.color2 = p.color2
          organicTweaks.color3 = p.color3
          organicTweaks.color4 = p.color4
          gui.controllersRecursive().forEach((c) => c.updateDisplay())
          startColorBlend(p)
        })

      const colorsFolder = gui.addFolder('Gradient Palette')
      colorsFolder.addColor(organicTweaks, 'color1').name('Shadow (Valley)').onChange(() => applyTweaksColorsToMaterial())
      colorsFolder.addColor(organicTweaks, 'color2').name('Mid Dark').onChange(() => applyTweaksColorsToMaterial())
      colorsFolder.addColor(organicTweaks, 'color3').name('Mid Light').onChange(() => applyTweaksColorsToMaterial())
      colorsFolder.addColor(organicTweaks, 'color4').name('Highlight (Peak)').onChange(() => applyTweaksColorsToMaterial())

      const fluidFolder = gui.addFolder('Fluid & Waves')
      fluidFolder.add(organicTweaks, 'speed', 0, 0.4).name('Flow Speed').onChange(() => applyTweaksToUniforms())
      fluidFolder.add(organicTweaks, 'angle', -Math.PI, Math.PI).name('Flow Angle').onChange(() => applyTweaksToUniforms())
      fluidFolder.add(organicTweaks, 'foldFrequency', 0.0, 5.0).name('Wave Scale').onChange(() => applyTweaksToUniforms())
      fluidFolder.add(organicTweaks, 'warpAmount', 0.0, 4.0).name('Liquid Warp').onChange(() => applyTweaksToUniforms())
      fluidFolder.add(organicTweaks, 'noiseScale', 0.0, 3.0).name('Noise Detail').onChange(() => applyTweaksToUniforms())
      fluidFolder.add(organicTweaks, 'connections', 0.0, 1.5).name('Organic Connections').onChange(() => applyTweaksToUniforms())

      const lightingFolder = gui.addFolder('Softness & Lighting')
      lightingFolder.add(organicTweaks, 'depth', 0.0, 2.5).name('Surface Softness').onChange(() => applyTweaksToUniforms())
      lightingFolder.add(organicTweaks, 'shadowWidth', 0.01, 0.4).name('Shadow Width').onChange(() => applyTweaksToUniforms())
      lightingFolder.add(organicTweaks, 'lightX', -2.0, 2.0).name('Light X').onChange(() => applyTweaksToUniforms())
      lightingFolder.add(organicTweaks, 'lightY', -2.0, 2.0).name('Light Y').onChange(() => applyTweaksToUniforms())

      organicGui = gui
    })
  }
})

onBeforeUnmount(() => {
  componentDisposed = true
  organicGui?.destroy()
  organicGui = null
  stopAnimationLoop()
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
  if (reducedMotionMql && reducedMotionHandler) {
    reducedMotionMql.removeEventListener('change', reducedMotionHandler)
    reducedMotionMql = null
    reducedMotionHandler = null
  }
  geometry?.dispose()
  geometry = null
  material?.dispose()
  material = null
  renderer?.dispose()
  renderer = null
  scene = null
  camera = null
})
</script>

<template>
  <div class="organic-background-root" aria-hidden="true">
    <canvas ref="canvasRef" class="organic-background" />
  </div>
</template>

<style scoped>
.organic-background-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.organic-background {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%) scale(1.09);
  transform-origin: center center;
  /* Heavy on compositor at full viewport; shader is already soft */
  filter: blur(5px);
}

@media (prefers-reduced-motion: reduce) {
  .organic-background {
    filter: blur(4px);
  }
}
</style>

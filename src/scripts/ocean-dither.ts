import { Geometry, Mesh, Program, Renderer, Texture } from 'ogl'

const VIDEO_ASPECT = 960 / 540
const GLYPHS = ' .·:-=+2367890#'
const BASE_CELL = 4
const DPR_CAP = 1.5

const VERTEX = `
precision highp float;
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const FRAGMENT = `
precision highp float;

uniform vec2 u_res;
uniform float u_cell;
uniform float u_videoAspect;
uniform sampler2D u_video;
uniform sampler2D u_glyphs;
uniform float u_count;
uniform vec3 u_bg;
uniform vec3 u_sky_fg;
uniform vec3 u_sky_accent;
uniform vec3 u_wave_fg;
uniform vec3 u_wave_accent;

vec2 coverUv(vec2 uv, float screenAspect) {
  vec2 scale = screenAspect > u_videoAspect
    ? vec2(1.0, u_videoAspect / screenAspect)
    : vec2(screenAspect / u_videoAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cellIndex = floor(frag / u_cell);
  vec2 cellCenter = (cellIndex + 0.5) * u_cell;
  vec2 cell = fract(frag / u_cell);

  vec2 uv = coverUv(cellCenter / u_res, u_res.x / u_res.y);
  vec3 tex = texture2D(u_video, uv).rgb;

  float lum = dot(tex, vec3(0.299, 0.587, 0.114));
  lum = clamp((lum - 0.045) * 1.14, 0.0, 1.0);

  float idx = floor(lum * (u_count - 1.0) + 0.5);
  float gx = (idx + cell.x) / u_count;
  float mask = texture2D(u_glyphs, vec2(gx, cell.y)).a;

  float screenY = cellCenter.y / u_res.y;
  float skyMix = smoothstep(0.55, 0.72, screenY);
  vec3 foreground = mix(u_wave_fg, u_sky_fg, skyMix);
  vec3 accent = mix(u_wave_accent, u_sky_accent, skyMix);
  float foam = smoothstep(0.58, 1.0, lum);
  float foamStrength = mix(0.58, 0.06, skyMix);
  vec3 glyphColor = mix(foreground, accent, foam * foamStrength);
  vec3 color = mix(u_bg, glyphColor, mask * clamp(lum * 0.96, 0.0, 1.0));

  float skyFade = smoothstep(0.26, 0.82, screenY);
  color = mix(color, u_bg, skyFade);
  gl_FragColor = vec4(color, 1.0);
}
`

function glyphAtlas() {
  const cell = 24
  const canvas = document.createElement('canvas')
  canvas.width = cell * GLYPHS.length
  canvas.height = cell

  const context = canvas.getContext('2d')
  if (!context) return canvas

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.font = `bold 20px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#fff'

  for (let index = 0; index < GLYPHS.length; index += 1) {
    context.fillText(GLYPHS[index] ?? ' ', index * cell + cell / 2, cell / 2 + 1)
  }

  return canvas
}

function colorToRgb(color: string): [number, number, number] {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d')
  if (!context) return [0, 0, 0]

  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [red = 0, green = 0, blue = 0] = context.getImageData(0, 0, 1, 1).data
  return [red / 255, green / 255, blue / 255]
}

export function initializeOceanDither() {
  const host = document.querySelector<HTMLElement>('.background-media')
  const canvas = document.querySelector<HTMLCanvasElement>('[data-ocean-dither]')
  const video = document.querySelector<HTMLVideoElement>('[data-ocean-source]')

  if (!host || !canvas || !video) return

  let renderer: Renderer

  try {
    renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio || 1, DPR_CAP),
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    })
  } catch (error) {
    host.dataset.ditherFallback = error instanceof Error ? error.message : 'WebGL unavailable'
    return
  }

  const gl = renderer.gl
  const videoTexture = new Texture(gl, {
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
  })
  const glyphTexture = new Texture(gl, {
    image: glyphAtlas(),
    flipY: true,
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
  })

  const styles = getComputedStyle(document.documentElement)
  const readColor = (name: string, fallback: string) =>
    colorToRgb(styles.getPropertyValue(name).trim() || fallback)

  const uniforms = {
    u_res: { value: [gl.canvas.width, gl.canvas.height] },
    u_cell: { value: BASE_CELL * renderer.dpr },
    u_videoAspect: { value: VIDEO_ASPECT },
    u_video: { value: videoTexture },
    u_glyphs: { value: glyphTexture },
    u_count: { value: GLYPHS.length },
    u_bg: { value: readColor('--dither-bg', '#071116') },
    u_sky_fg: { value: readColor('--dither-sky', '#515a6b') },
    u_sky_accent: { value: readColor('--dither-sky-accent', '#606b7d') },
    u_wave_fg: { value: readColor('--dither-wave', '#687589') },
    u_wave_accent: { value: readColor('--dither-foam', '#6c91a8') },
  }

  const program = new Program(gl, { vertex: VERTEX, fragment: FRAGMENT, uniforms })
  const geometry = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
  })
  const mesh = new Mesh(gl, { geometry, program })
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  let animationFrame = 0
  let running = false
  let hasRendered = false
  let lastWidth = 0
  let lastHeight = 0

  function resize() {
    const width = Math.max(1, Math.round(host?.clientWidth ?? window.innerWidth))
    const height = Math.max(1, Math.round(host?.clientHeight ?? window.innerHeight))
    if (width === lastWidth && height === lastHeight) return false

    lastWidth = width
    lastHeight = height
    renderer.setSize(width, height)
    uniforms.u_res.value = [gl.canvas.width, gl.canvas.height]
    uniforms.u_cell.value = BASE_CELL * renderer.dpr
    return true
  }

  function render() {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.seeking) return

    videoTexture.image = video
    videoTexture.needsUpdate = true
    renderer.render({ scene: mesh })

    if (!hasRendered) {
      hasRendered = true
      host?.classList.add('dither-ready')
    }
  }

  function frame() {
    if (!running) return
    render()
    animationFrame = window.requestAnimationFrame(frame)
  }

  function start() {
    if (running || reducedMotion.matches || document.hidden) return
    running = true
    void video.play().catch(() => {})
    animationFrame = window.requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    window.cancelAnimationFrame(animationFrame)
    video.pause()
  }

  function renderStatic() {
    resize()
    render()
    video.pause()
  }

  function onResize() {
    if (resize() && (!running || reducedMotion.matches)) render()
  }

  function onVisibilityChange() {
    if (document.hidden) stop()
    else if (reducedMotion.matches) renderStatic()
    else start()
  }

  function onMotionChange() {
    if (reducedMotion.matches) {
      stop()
      renderStatic()
    } else {
      start()
    }
  }

  resize()
  video.addEventListener('loadeddata', reducedMotion.matches ? renderStatic : start, { once: true })
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibilityChange)
  reducedMotion.addEventListener('change', onMotionChange)

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    if (reducedMotion.matches) renderStatic()
    else start()
  } else {
    void video.play().catch(() => {})
  }
}

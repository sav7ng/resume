"use client"

import { useEffect, useRef } from "react"

/** A local, procedural sculpture: no remote models, fonts, or textures. */
export function SavingMarkThree() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let cancelled = false
    let dispose = () => {}

    async function mount() {
      const THREE = await import("three")
      if (cancelled || !host) return
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.25
      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-5, 5, 3.7, -3.7, 0.1, 50)
      camera.position.set(0, 0, 15)
      // Front and rear contours share the original five-by-five S silhouette.
      const outline = [
        [0, 0],
        [5, 0],
        [5, 1],
        [1, 1],
        [1, 2],
        [5, 2],
        [5, 5],
        [0, 5],
        [0, 4],
        [4, 4],
        [4, 3],
        [0, 3],
      ]
      const frontMaterial = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        toneMapped: false,
      })
      const rearMaterial = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        toneMapped: false,
      })
      const hatchMaterial = new THREE.LineBasicMaterial({
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        toneMapped: false,
      })
      const sculpture = new THREE.Group()
      const geometries: InstanceType<typeof THREE.BufferGeometry>[] = []
      const contour = (
        z: number,
        material: InstanceType<typeof THREE.LineBasicMaterial>
      ) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(
          outline.map(([x, y]) => new THREE.Vector3(x - 2.5, 2.5 - y, z))
        )
        geometries.push(geometry)
        sculpture.add(new THREE.LineLoop(geometry, material))
      }
      contour(-0.35, rearMaterial)
      contour(0.35, frontMaterial)
      const ribs: number[] = []
      const hatches: number[] = []
      outline.forEach(([x, y], i) => {
        const [nx, ny] = outline[(i + 1) % outline.length]
        const length = Math.hypot(nx - x, ny - y)
        const point = (distance: number, z: number) => [
          x - 2.5 + ((nx - x) * distance) / length,
          2.5 - y - ((ny - y) * distance) / length,
          z,
        ]
        ribs.push(...point(0, -0.35), ...point(0, 0.35))
        // Clip diagonal strokes to each side panel, including both end corners.
        const slant = 0.38
        for (let start = -slant; start < length; start += 0.16) {
          const lo = Math.max(0, -start / slant)
          const hi = Math.min(1, (length - start) / slant)
          if (lo >= hi) continue
          hatches.push(
            ...point(start + lo * slant, -0.35 + lo * 0.7),
            ...point(start + hi * slant, -0.35 + hi * 0.7)
          )
        }
      })
      for (const [vertices, material] of [
        [ribs, rearMaterial],
        [hatches, hatchMaterial],
      ] as const) {
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3)
        )
        geometries.push(geometry)
        sculpture.add(new THREE.LineSegments(geometry, material))
      }
      const rest = { x: 0.68, y: -0.45, z: -0.48 }
      sculpture.rotation.set(rest.x, rest.y, rest.z)
      scene.add(sculpture)

      // Two detuned sines with random phases drift the pose without repeating.
      const drift = (amplitude: number) => {
        const slow = 0.085 + Math.random() * 0.07
        const fast = slow * (1.7 + Math.random() * 0.7)
        const slowPhase = Math.random() * Math.PI * 2
        const fastPhase = Math.random() * Math.PI * 2
        return (at: number) =>
          amplitude *
          (Math.sin(at * slow + slowPhase) * 0.68 +
            Math.sin(at * fast + fastPhase) * 0.32)
      }
      // The drift swings around its own centre, not the resting pose: pulling y
      // back towards zero keeps both ends of a wide sweep off the edge-on angle
      // that would collapse the S into a sliver. x stays shallowest so the top
      // of the travel never reads as a flat plan view.
      const sway = { x: 0.68, y: -0.2, z: -0.48 }
      const driftX = drift(0.22)
      const driftY = drift(0.8)
      const driftZ = drift(0.22)

      let frame = 0
      let visible = false
      let lost = false
      let time = 0
      let previous = 0
      let pointerX = 0
      let pointerY = 0
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      const render = (now: number) => {
        frame = 0
        if (lost) return
        const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0
        previous = now
        if (!reduced.matches) time += dt
        const blend = reduced.matches ? 1 : 1 - Math.exp(-dt * 3.2)
        const target = reduced.matches
          ? rest
          : {
              x: sway.x + driftX(time) + pointerY * 0.11,
              y: sway.y + driftY(time) + pointerX * 0.18,
              z: sway.z + driftZ(time),
            }
        sculpture.rotation.x += (target.x - sculpture.rotation.x) * blend
        sculpture.rotation.y += (target.y - sculpture.rotation.y) * blend
        sculpture.rotation.z += (target.z - sculpture.rotation.z) * blend
        sculpture.position.y = reduced.matches
          ? 0
          : Math.sin(time * 0.75) * 0.085
        renderer.render(scene, camera)
        host.dataset.ready = "true"
        if (visible && !document.hidden && !reduced.matches)
          frame = requestAnimationFrame(render)
      }
      const refresh = () => {
        cancelAnimationFrame(frame)
        previous = 0
        if (visible && !document.hidden && !lost)
          frame = requestAnimationFrame(render)
      }
      const resize = new ResizeObserver(() => {
        const { width, height } = host.getBoundingClientRect()
        if (!width || !height) return
        const halfHeight = 3.65
        const halfWidth = (halfHeight * width) / height
        camera.left = -halfWidth
        camera.right = halfWidth
        camera.top = halfHeight
        camera.bottom = -halfHeight
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        refresh()
      })
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        refresh()
      })
      const theme = new MutationObserver(() => {
        updateTheme()
        refresh()
      })
      const updateTheme = () => {
        const dark = document.documentElement.classList.contains("dark")
        for (const material of [frontMaterial, rearMaterial, hatchMaterial]) {
          material.color.setHex(dark ? 0xd4d4d8 : 0x52525b)
        }
      }
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || reduced.matches) return
        const rect = host.getBoundingClientRect()
        pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1
      }
      const leave = () => {
        pointerX = 0
        pointerY = 0
      }
      const contextLost = (event: Event) => {
        event.preventDefault()
        lost = true
        cancelAnimationFrame(frame)
        delete host.dataset.ready
      }
      const contextRestored = () => {
        lost = false
        refresh()
      }
      renderer.domElement.setAttribute("aria-hidden", "true")
      renderer.domElement.className =
        "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-data-[ready=true]:opacity-100"
      host.appendChild(renderer.domElement)
      updateTheme()
      resize.observe(host)
      intersection.observe(host)
      theme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      host.addEventListener("pointermove", move)
      host.addEventListener("pointerleave", leave)
      renderer.domElement.addEventListener("webglcontextlost", contextLost)
      renderer.domElement.addEventListener(
        "webglcontextrestored",
        contextRestored
      )
      reduced.addEventListener("change", refresh)
      document.addEventListener("visibilitychange", refresh)
      dispose = () => {
        cancelAnimationFrame(frame)
        resize.disconnect()
        intersection.disconnect()
        theme.disconnect()
        host.removeEventListener("pointermove", move)
        host.removeEventListener("pointerleave", leave)
        reduced.removeEventListener("change", refresh)
        document.removeEventListener("visibilitychange", refresh)
        renderer.domElement.removeEventListener("webglcontextlost", contextLost)
        renderer.domElement.removeEventListener(
          "webglcontextrestored",
          contextRestored
        )
        geometries.forEach((geometry) => geometry.dispose())
        frontMaterial.dispose()
        rearMaterial.dispose()
        hatchMaterial.dispose()
        renderer.dispose()
        renderer.domElement.remove()
        delete host.dataset.ready
      }
    }
    void mount().catch(() => {
      dispose()
    })
    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      className="group relative aspect-[1.57] w-full overflow-hidden"
      role="img"
      aria-label="Saving 的空心线框 S 标志"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse,black,transparent_72%)] bg-size-[40px_40px] opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-data-[ready=true]:opacity-0 motion-reduce:transition-none"
      >
        <svg
          viewBox="0 0 320 320"
          className="h-[65%] w-auto -rotate-6 text-foreground/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M0 0H320V64H64V128H320V320H0V256H256V192H0Z" />
        </svg>
      </div>
    </div>
  )
}

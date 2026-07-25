/* BorderGlow — vanilla JS port of React Bits BorderGlow */

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
  return x * x * x;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

class BorderGlow {
  constructor(options = {}) {
    this.options = {
      className: "",
      edgeSensitivity: 30,
      glowColor: "40 80 80",
      backgroundColor: "#120F17",
      borderRadius: 28,
      glowRadius: 40,
      glowIntensity: 1.0,
      coneSpread: 25,
      animated: false,
      colors: ["#c084fc", "#f472b6", "#38bdf8"],
      fillOpacity: 0.5,
      ...options,
    };

    this.element = this.build();
    this.bindEvents();

    if (this.options.animated) {
      this.runSweepAnimation();
    }
  }

  getCenterOfElement(el) {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }

  getEdgeProximity(el, x, y) {
    const [cx, cy] = this.getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  getCursorAngle(el, x, y) {
    const [cx, cy] = this.getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }

  applyStyles(card) {
    const o = this.options;
    const glowVars = buildGlowVars(o.glowColor, o.glowIntensity);
    const gradientVars = buildGradientVars(o.colors);

    card.style.setProperty("--card-bg", o.backgroundColor);
    card.style.setProperty("--edge-sensitivity", o.edgeSensitivity);
    card.style.setProperty("--border-radius", `${o.borderRadius}px`);
    card.style.setProperty("--glow-padding", `${o.glowRadius}px`);
    card.style.setProperty("--cone-spread", o.coneSpread);
    card.style.setProperty("--fill-opacity", o.fillOpacity);

    Object.entries({ ...glowVars, ...gradientVars }).forEach(([key, value]) => {
      card.style.setProperty(key, value);
    });
  }

  build() {
    const o = this.options;
    const card = document.createElement("div");
    card.className = `border-glow-card ${o.className}`.trim();
    this.applyStyles(card);

    const edgeLight = document.createElement("span");
    edgeLight.className = "edge-light";
    edgeLight.setAttribute("aria-hidden", "true");

    const inner = document.createElement("div");
    inner.className = "border-glow-inner";

    if (o.content instanceof HTMLElement) {
      inner.appendChild(o.content);
    } else if (typeof o.content === "string") {
      inner.innerHTML = o.content;
    }

    card.appendChild(edgeLight);
    card.appendChild(inner);

    return card;
  }

  bindEvents() {
    this.handlePointerMove = (e) => {
      const card = this.element;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const edge = this.getEdgeProximity(card, x, y);
      const angle = this.getCursorAngle(card, x, y);
      card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    };

    this.element.addEventListener("pointermove", this.handlePointerMove);
  }

  runSweepAnimation() {
    const card = this.element;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    animateValue({
      duration: 500,
      onUpdate: (v) => card.style.setProperty("--edge-proximity", v),
    });

    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
      },
    });

    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
      },
    });

    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => card.style.setProperty("--edge-proximity", v),
      onEnd: () => card.classList.remove("sweep-active"),
    });
  }

  mount(parent) {
    if (typeof parent === "string") {
      document.querySelector(parent).appendChild(this.element);
    } else {
      parent.appendChild(this.element);
    }
    return this.element;
  }
}

window.BorderGlow = BorderGlow;

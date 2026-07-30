// Cache the primary canvas and interface elements used throughout the experience.
const canvas = document.querySelector("#spaceCanvas");
const ctx = canvas.getContext("2d");
const stage = document.querySelector("#spaceStage");
const tooltip = document.querySelector("#phaseTooltip");
const phaseStrip = document.querySelector("#phaseStrip");
const keyboardHint = document.querySelector("#keyboardHint");

// Define the eight lunar phases and the copy shown in the phase dialog.
const phaseNames = [
  "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
  "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
];
const phaseDescriptions = [
  "The Moon is between Earth and the Sun. Its sunlit half faces away from us, so it is nearly invisible in our sky.",
  "A slim curve of sunlight appears on the Moon’s right side. The visible bright portion grows a little each night.",
  "Half of the Moon’s Earth-facing side is illuminated. It is one quarter of the way through its phase cycle.",
  "More than half is illuminated and still growing. A waxing gibbous Moon rises during the afternoon.",
  "Earth is roughly between the Sun and Moon, so the entire Earth-facing side appears bright.",
  "The bright portion begins shrinking after full Moon. A waning gibbous Moon is often visible after midnight.",
  "Half of the visible Moon is illuminated again, this time on the opposite side. It rises around midnight.",
  "Only a thin curve remains before new Moon. Look east shortly before sunrise to spot it."
];

// Supply the rotating educational facts displayed in Phase Atlas.
const facts = [
  ["STARTER", "LOOK UP", "The Moon does not make its own light. It reflects sunlight—just like a giant, dusty mirror.", "https://science.nasa.gov/moon/moon-phases/"],
  ["STARTER", "SAME MOON", "Everyone on Earth sees the same lunar phase, although the Moon can look rotated in different hemispheres.", "https://science.nasa.gov/moon/moon-phases/"],
  ["STARTER", "SPACE CLOCK", "A complete cycle of phases takes about 29.5 days. This is called a synodic month.", "https://science.nasa.gov/moon/moon-phases/"],
  ["CURIOUS", "LOCKED ON", "The Moon rotates once each orbit, so nearly the same side always faces Earth. This is tidal locking.", "https://science.nasa.gov/moon/tidal-locking/"],
  ["CURIOUS", "NOT A SHADOW", "Moon phases are not caused by Earth’s shadow. Earth’s shadow causes a lunar eclipse.", "https://science.nasa.gov/moon/eclipses/"],
  ["CURIOUS", "MOON CHEESE", "Old fables tell of a hungry animal mistaking the Moon’s reflection in a well for cheese. By 1546, “the Moon is made of green cheese” had become a joke about gullibility. “Green” meant fresh or unaged—not green-coloured.", "https://wehd.com/15/Cheese_sb1.html", "Historical Dictionary"],
  ["CURIOUS", "TWO HIGH TIDES", "The Moon’s gravity helps create ocean tides. Most coasts experience two high tides each lunar day.", "https://science.nasa.gov/moon/tides/"],
  ["DEEP DIVE", "FIVE DEGREES", "The Moon’s orbit is tilted about 5° to Earth’s path around the Sun—which is why eclipses do not happen monthly.", "https://science.nasa.gov/moon/eclipses/"],
  ["DEEP DIVE", "FARTHER AWAY", "The Moon drifts roughly 3.8 centimetres away from Earth each year.", "https://science.nasa.gov/moon/tidal-locking/"],
  ["DEEP DIVE", "A LONG DAY", "Sunrise to sunrise on the Moon takes about 29.5 Earth days, making each lunar daytime roughly two weeks long.", "https://science.nasa.gov/moon/facts/"],
  ["WOW", "SMALLER SUN", "The Sun is about 400 times wider than the Moon—and also about 400 times farther away. That is why total eclipses fit so neatly.", "https://science.nasa.gov/eclipses/geometry/"],
  ["WOW", "OLD FOOTPRINTS", "With almost no wind or rain, astronaut footprints on the Moon may remain for millions of years.", "https://starchild.gsfc.nasa.gov/docs/StarChild/space_level1/apollo11.html"]
];

// Define the ordered Deep Dive chapters and their matching visual treatments.
const topics = [
  {
    short: "Origin", title: "Born from a giant collision",
    summary: "About 4.5 billion years ago, a young world roughly the size of Mars struck the early Earth. Debris blasted into orbit, gathered together, and became our Moon.",
    details: "<strong>How long did it take?</strong> In traditional debris-disk models, the Moon gathered over months or years; some models take roughly 100 years. A newer high-resolution simulation suggests a large Moon-like body could have formed in only hours. The exact route is still an open scientific question.",
    visual: "collision",
    sources: [
      { label: "Nature", url: "https://www.nature.com/articles/38669" },
      { label: "ApJ", url: "https://doi.org/10.1088/0004-637X/760/1/83" },
      { label: "ApJ Letters", url: "https://doi.org/10.3847/2041-8213/ac8d96" }
    ]
  },
  {
    short: "Locked", title: "One face, always watching",
    summary: "The young Moon spun faster than it does today. Earth’s gravity stretched it slightly, raising a tidal bulge that did not point perfectly toward Earth while the Moon was turning.",
    details: "<strong>How the lock formed:</strong> Earth’s gravity kept pulling on the misaligned bulge, creating a torque that resisted the Moon’s spin. Repeated flexing inside the Moon converted some of that rotational energy into heat, so its rotation gradually slowed.<br><br><strong>The stable rhythm:</strong> Eventually one rotation took the same time as one orbit around Earth. The bulge could then remain broadly aligned with Earth, and nearly the same lunar hemisphere kept facing us. The Moon still rotates once per orbit—and its far side receives sunlight too, so it is not a permanently dark side.",
    visual: "locked",
    source: "https://science.nasa.gov/moon/tidal-locking/"
  },
  {
    short: "Cold traps", title: "Dark for billions of years",
    summary: "The Moon’s axis is tilted only about 1.5° relative to its path around the Sun. Near the poles, that keeps the Sun skimming close to the horizon all year.",
    details: "<strong>Why the darkness lasts:</strong> Because the Sun never climbs high in the polar sky, the tall rims of deep craters can block its light from reaching the floors. The small axial tilt and the crater shape work together to create permanently shadowed regions—the far side itself is not permanently dark.<br><br><strong>Why the cold stays:</strong> The Moon has only an extremely thin exosphere, not a substantial atmosphere. There is almost no air to circulate warmth from sunlit ground into the shadows, so heat cannot move around the way it does on Earth.<br><br><strong>Polar cold traps:</strong> With no direct sunlight, these floors become extraordinarily cold. Hermite Crater near the north pole contains the coldest place measured in the solar system: about −249°C. Water and other volatile materials that enter these shadows may remain frozen for billions of years.",
    visual: "coldtrap",
    sources: [
      { label: "NASA: Polar Shadows", url: "https://science.nasa.gov/resource/shackleton-craters-illuminated-rim-shadowed-interior/" },
      { label: "NASA: Hermite Crater", url: "https://science.nasa.gov/image-detail/hermite/" },
      { label: "NASA: Lunar Weather", url: "https://science.nasa.gov/moon/weather-on-the-moon/" }
    ]
  },
  {
    short: "Impacts", title: "Is the Moon our asteroid shield?",
    summary: "The cratered Moon has intercepted countless space rocks, but it is too small and far away to act as a reliable shield for Earth.",
    details: "<strong>The bigger protection:</strong> The Moon’s gravity helps stabilize Earth’s axial tilt, supporting a more stable long-term climate. Its craters also preserve a valuable record of impacts in our neighbourhood.",
    visual: "impacts",
    sources: [
      { label: "Advances in Space Research", url: "https://doi.org/10.1016/S0273-1177(03)00459-9" },
      { label: "Nature", url: "https://www.nature.com/articles/361615a0" }
    ]
  },
  {
    short: "Day Moon", title: "Why it appears in daylight",
    summary: "The Moon spends almost as much time above the horizon during daytime as at night. It is large and bright enough for reflected sunlight to stand out against the blue sky.",
    details: "<strong>When to look:</strong> Waxing phases are often visible in the afternoon; waning phases often appear in the morning. A full Moon is mainly opposite the Sun, so it rises near sunset.",
    visual: "daylight",
    source: "https://science.nasa.gov/moon/moon-phases/"
  },
  {
    short: "Moon words", title: "Waxing, waning… gibbous?",
    summary: "The phase names become much easier once you know the old words hiding inside them: waxing grows, waning fades, and gibbous describes a rounded hump.",
    details: "<strong>Waxing:</strong> from an old verb meaning “to grow.” The lit portion we see is increasing.<br><br><strong>Waning:</strong> from Old English <em>wanian</em>, “to lessen.” The lit portion is decreasing.<br><br><strong>Gibbous:</strong> from Latin <em>gibbus</em>, “hump.” The Moon looks rounded and is more than half lit.<br><br><strong>In Hebrew:</strong> <span lang=\"he\" dir=\"rtl\">מִתְמַלֵּא</span> means “filling,” <span lang=\"he\" dir=\"rtl\">מִתְמַעֵט</span> means “diminishing,” and <span lang=\"he\" dir=\"rtl\">גַּבְנוּנִי</span> means “hump-shaped.” The gibbous phase is also described plainly as <span lang=\"he\" dir=\"rtl\">כִּמְעַט מָלֵא</span>—“almost full.”<br><br><strong>Memory line:</strong> A waxing gibbous Moon is a hump growing toward full; a waning gibbous Moon is a hump fading from full.",
    visual: "moon-words",
    sources: [
      { label: "Merriam-Webster: Wane", url: "https://www.merriam-webster.com/dictionary/wane" },
      { label: "Merriam-Webster: Gibbous", url: "https://www.merriam-webster.com/word-of-the-day/gibbous-2022-07-10" },
      { label: "Israel Space Agency", url: "https://www.space.gov.il/inspiration/159" },
      { label: "Hebrew Academy", url: "https://terms.hebrew-academy.org.il/munnah?kodErekhIvrit=2920" }
    ]
  },
  {
    short: "Five degrees", title: "How a full Moon stays bright",
    summary: "At full Moon, Earth is between the Sun and Moon in the broad sense—but the three bodies are usually not lined up precisely.",
    details: "<strong>The five-degree escape:</strong> The Moon’s orbit is tilted about 5° to Earth’s orbital plane. Most months the full Moon passes above or below Earth’s shadow, so sunlight reaches it. Precise alignment produces a lunar eclipse.",
    visual: "tilted",
    source: "https://science.nasa.gov/moon/eclipses/"
  },
  {
    short: "Solar eclipse", title: "The Moon’s shadow reaches Earth",
    summary: "During a solar eclipse, the Moon passes between the Sun and Earth. Its narrow shadow falls onto a small part of Earth’s surface.",
    details: "<strong>From Earth:</strong> People inside the darkest central shadow, the umbra, can see a total eclipse. People in the lighter penumbra see a partial eclipse. The 5° orbital tilt makes this precise alignment uncommon.",
    visual: "solar-eclipse",
    source: "https://science.nasa.gov/eclipses/geometry/"
  },
  {
    short: "Lunar eclipse", title: "Earth’s shadow reaches the Moon",
    summary: "During a lunar eclipse, Earth passes between the Sun and the full Moon. Earth’s shadow extends away from the Sun and the Moon travels through it.",
    details: "<strong>Lunar eclipse vs new Moon:</strong> A lunar eclipse happens at full Moon, when Earth sits between the Sun and Moon and casts its shadow onto the Moon. At new Moon, the order is reversed—the Moon sits between Earth and the Sun, so its unlit side faces us.<br><br><strong>Why the Moon turns red:</strong> Earth’s atmosphere bends filtered red sunlight into the shadow. Unlike a solar eclipse, a lunar eclipse can be seen from the entire night side of Earth.",
    visual: "lunar-eclipse",
    source: "https://science.nasa.gov/moon/eclipses/"
  }
];

// Build the ordered paths for the fact-card image sequence.
const factImagePaths = Array.from(
  { length: 9 },
  (_, index) => `assets/moon-pics/pic-${String(index + 1).padStart(2, "0")}.png`
);
factImagePaths.forEach(path => {
  const image = new Image();
  image.src = path;
});

// Hold the current mode, selection, animation, and viewing preferences.
const state = {
  mode: "atlas",
  orbitAngle: Math.PI,
  fact: 0,
  points: [],
  dpr: 1,
  sound: true,
  hemisphere: "south",
  autoOrbit: false,
  lastFrame: 0,
  topic: 0
};

/** Resize the canvas to match its displayed size and redraw the scene. */
function resize() {
  const box = stage.getBoundingClientRect();
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(box.width * state.dpr);
  canvas.height = Math.round(box.height * state.dpr);
  canvas.style.width = `${box.width}px`;
  canvas.style.height = `${box.height}px`;
  draw();
}

/** Paint a deterministic field of stars across the canvas. */
function starfield(w, h) {
  const seed = (n) => {
    const x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 145; i++) {
    const x = seed(i) * w;
    const y = seed(i + 999) * h;
    const r = seed(i + 351) > .9 ? 1.1 : .5;
    ctx.fillStyle = `rgba(230,238,235,${.18 + seed(i + 82) * .45})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
}

/** Draw the Moon's orbital path around Earth. */
function drawOrbit(cx, cy, rx, ry) {
  ctx.save();
  ctx.strokeStyle = "rgba(226,232,225,.17)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 7]);
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

/** Render a shaded Earth or Moon sphere for the current lighting angle. */
function sphere(x, y, radius, kind, lightDirection = 1, phaseAngle = 0) {
  const size = radius * 2;
  const image = ctx.createImageData(size, size);
  const data = image.data;
  for (let py = 0; py < radius * 2; py++) {
    for (let px = 0; px < radius * 2; px++) {
      const nx = (px - radius) / radius;
      const ny = (py - radius) / radius;
      const r2 = nx * nx + ny * ny;
      if (r2 > 1) continue;
      const nz = Math.sqrt(1 - r2);
      const idx = (py * radius * 2 + px) * 4;
      let brightness;
      let cr, cg, cb;
      if (kind === "earth") {
        brightness = Math.max(.05, nx * .8 + nz * .55);
        const swirl = Math.sin(nx * 17 + ny * 12) + Math.sin(ny * 21 - nx * 8);
        const land = swirl + Math.sin(nx * 5) > .7;
        [cr, cg, cb] = land ? [64, 105, 73] : [39, 96, 120];
        if (Math.abs(ny) > .76) [cr, cg, cb] = [196, 209, 201];
        if (Math.sin(nx * 29 + ny * 7) > 0.82) [cr, cg, cb] = [184, 196, 187];
      } else {
        const lx = Math.cos(phaseAngle);
        const lz = Math.sin(phaseAngle);
        brightness = Math.max(.025, nx * lx + nz * lz);
        const crater = Math.sin(px * 1.7 + py * 2.3) * Math.sin(py * .73 - px * .41);
        const base = 176 + crater * 12;
        [cr, cg, cb] = [base, base - 2, base - 8];
      }
      const edge = Math.min(1, nz * 4);
      data[idx] = cr * brightness;
      data[idx + 1] = cg * brightness;
      data[idx + 2] = cb * brightness;
      data[idx + 3] = 255 * edge;
    }
  }
  // putImageData ignores the canvas transform, which displaced moons on
  // high-density displays. Draw through a small buffer so DPR scaling applies.
  const buffer = document.createElement("canvas");
  buffer.width = size;
  buffer.height = size;
  buffer.getContext("2d").putImageData(image, 0, 0);
  ctx.drawImage(buffer, Math.round(x - radius), Math.round(y - radius), size, size);
}

/** Draw Earth with ocean, land, atmosphere, and location marker details. */
function drawEarth(x, y, radius) {
  ctx.save();
  ctx.shadowColor = "rgba(43,151,213,.42)";
  ctx.shadowBlur = 38;
  const ocean = ctx.createRadialGradient(x - radius * .3, y - radius * .35, radius * .08, x, y, radius);
  ocean.addColorStop(0, "#7bd9ff");
  ocean.addColorStop(.42, "#1988c7");
  ocean.addColorStop(.82, "#075183");
  ocean.addColorStop(1, "#03283f");
  ctx.fillStyle = ocean;
  ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(168,225,255,.32)";
  ctx.lineWidth = Math.max(2, radius * .045);
  ctx.stroke();
  ctx.strokeStyle = "rgba(0,0,0,.72)";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 5]);
  ctx.beginPath();
  ctx.ellipse(x, y, radius * .94, radius * .18, 0, 0, Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);
  const markerY = y + radius * (state.hemisphere === "south" ? .42 : -.42);
  const markerX = x + radius * .34;
  ctx.fillStyle = "#ff6b35";
  ctx.shadowColor = "#ff6b35";
  ctx.shadowBlur = 9;
  ctx.beginPath();
  ctx.arc(markerX, markerY, Math.max(3, radius * .045), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const earthLabel = document.querySelector("#earthLabel");
  earthLabel.style.left = `${markerX}px`;
  earthLabel.style.top = `${markerY}px`;
}

/** Draw the Sun and its glow at the edge of the scene. */
function drawSun(w, h) {
  const x = w + 65;
  const y = h * .43;
  const glow = ctx.createRadialGradient(x, y, 5, x, y, 210);
  glow.addColorStop(0, "rgba(255,239,194,1)");
  glow.addColorStop(.2, "rgba(255,137,56,.7)");
  glow.addColorStop(.55, "rgba(255,91,31,.16)");
  glow.addColorStop(1, "rgba(255,89,25,0)");
  ctx.fillStyle = glow; ctx.fillRect(w - 250, y - 240, 300, 480);
  ctx.fillStyle = "#fff3c3"; ctx.beginPath(); ctx.arc(x, y, 105, 0, Math.PI * 2); ctx.fill();
}

/** Render the complete orbital scene for the active mode and viewport. */
function draw() {
  const w = canvas.width / state.dpr;
  const h = canvas.height / state.dpr;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  starfield(w, h);
  drawSun(w, h);
  const cx = w * (w < 700 ? .5 : .52);
  const cy = h * .43;
  const rx = Math.min(w * (w < 700 ? .39 : .32), 430);
  const ry = Math.min(h * .28, 205);
  drawOrbit(cx, cy, rx, ry);
  state.points = [];

  const earthR = Math.round(
    state.mode === "orbit"
      ? Math.max(72, Math.min(110, w * .09))
      : Math.max(54, Math.min(84, w * .068))
  );
  const moons = state.mode === "atlas" || state.mode === "deep"
    ? phaseNames.map((name, i) => ({ angle: i * Math.PI / 4, name }))
    : [{ angle: state.orbitAngle, name: phaseAtAngle(state.orbitAngle) }];

  const ordered = moons.map((m, i) => {
    const depth = Math.sin(m.angle);
    return { ...m, i, depth, x: cx + Math.cos(m.angle) * rx, y: cy + depth * ry };
  }).sort((a, b) => a.depth - b.depth);

  ordered.filter(m => m.depth < 0).forEach(drawMoon);
  drawEarth(cx, cy, earthR);
  ordered.filter(m => m.depth >= 0).forEach(drawMoon);

  function drawMoon(m) {
    const radius = Math.round(
      state.mode === "atlas" || state.mode === "deep"
        ? Math.max(20, Math.min(30, w * .024))
        : Math.max(46, Math.min(68, w * .052))
    );
    // The Sun is fixed to the right: near-side moons look new, far-side moons look full.
    // Keep the terminator direction continuous around the full orbit:
    // new → first quarter → full → last quarter → new.
    const northernLight = m.angle - Math.PI / 2;
    const phaseLight = state.hemisphere === "south" ? Math.PI - northernLight : northernLight;
    sphere(m.x, m.y, radius, "moon", 1, phaseLight);
    if (state.mode === "atlas") {
      ctx.fillStyle = "rgba(245,241,232,.65)";
      ctx.font = '8px "DM Mono"';
      ctx.textAlign = "center";
      ctx.fillText(String(m.i + 1).padStart(2, "0"), m.x, m.y + radius + 14);
    }
    state.points.push({ x: m.x, y: m.y, r: radius + 8, name: m.name });
  }
}

/** Convert an orbital angle into its nearest lunar-phase index. */
function phaseAtAngle(a) {
  const normalized = ((a + Math.PI * 2) % (Math.PI * 2));
  const index = Math.round(normalized / (Math.PI / 4)) % 8;
  return phaseNames[index];
}

/** Switch modes and synchronize the related controls, copy, and panels. */
function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-button").forEach(btn => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active);
  });
  const orbit = mode === "orbit";
  const deep = mode === "deep";
  document.querySelector("#modeEyebrow").textContent = deep ? "GO FURTHER" : orbit ? "TAKE CONTROL" : "THE COMPLETE CYCLE";
  document.querySelector("#modeTitle").innerHTML = deep ? "Eight questions.<br><em>Deeper answers.</em>" : orbit ? "Move the Moon.<br><em>Watch light shift.</em>" : "Eight phases.<br><em>One orbit.</em>";
  document.querySelector("#modeDescription").textContent = deep
    ? "Explore the Moon’s origin, motion, eclipses, daylight appearances and the view from lunar space."
    : orbit ? "Use the arrow keys or drag across space. Notice how the Moon’s position changes the sunlit part we see."
    : "See the Moon’s sunlit half from eight different points in its journey around Earth.";
  keyboardHint.hidden = !orbit;
  keyboardHint.querySelector("span:nth-child(2)").textContent = orbit ? "ARROWS · ENTER FOR AUTO ORBIT" : "MOVE THE MOON";
  phaseStrip.style.opacity = deep ? ".15" : orbit ? ".35" : "1";
  document.querySelector(".fact-card").hidden = mode !== "atlas";
  document.querySelector("#deepDive").hidden = !deep;
  stage.hidden = deep;
  stage.setAttribute("aria-hidden", String(deep));
  document.querySelector(".intro").style.opacity = deep ? "0" : "1";
  draw();
}

phaseNames.forEach((name, i) => {
  const chip = document.createElement("button");
  chip.className = "phase-chip";
  chip.innerHTML = `<i class="mini-moon phase-${i}"></i>${name}`;
  chip.addEventListener("click", () => {
    if (state.mode === "atlas") openPhase(i);
  });
  phaseStrip.appendChild(chip);
});

// Generate the Deep Dive navigation from the ordered topic data.
const topicTabs = document.querySelector("#topicTabs");
topics.forEach((topic, index) => {
  const button = document.createElement("button");
  button.className = "topic-tab";
  button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${topic.short}`;
  button.addEventListener("click", () => renderTopic(index));
  topicTabs.appendChild(button);
});

/** Display a Deep Dive chapter and its corresponding diagram. */
function renderTopic(index) {
  state.topic = index;
  const topic = topics[index];
  document.querySelectorAll(".topic-tab").forEach((button, i) => button.classList.toggle("active", i === index));
  document.querySelector("#topicNumber").textContent = `DEEP DIVE ${String(index + 1).padStart(2, "0")} / ${String(topics.length).padStart(2, "0")}`;
  document.querySelector("#topicTitle").textContent = topic.title;
  document.querySelector("#topicSummary").textContent = topic.summary;
  document.querySelector("#topicDetails").innerHTML = topic.details;
  const sources = topic.sources || [{ label: "NASA", url: topic.source }];
  const sourceList = document.querySelector("#topicSources");
  sourceList.replaceChildren();
  sources.forEach((source, sourceIndex) => {
    if (sourceIndex > 0) sourceList.append(" · ");
    const link = document.createElement("a");
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = source.label;
    sourceList.append(link);
  });
  document.querySelector("#eclipseSafety").hidden = topic.visual !== "solar-eclipse";
  const visual = document.querySelector("#topicVisual");
  visual.className = `topic-visual ${topic.visual}`;

  const diagrams = {
    collision: `<div class="debris"></div><div class="diagram-earth"></div><div class="diagram-impact"></div><div class="origin-cloud"></div><div class="diagram-moon origin-moon"></div><div class="origin-controls"><input id="originSlider" type="range" min="0" max="4" step="1" value="0" aria-label="Giant impact timeline"><div class="origin-labels"><span>APPROACH</span><span>IMPACT</span><span>DISK</span><span>CLUMPING</span><span>MOON</span></div></div><p class="diagram-caption" id="originCaption">A MARS-SIZED BODY APPROACHES THE YOUNG EARTH</p>`,
    locked: `<div class="diagram-orbit"></div><div class="diagram-earth"></div><div class="diagram-moon"></div><p class="diagram-caption">ONE ROTATION = ONE ORBIT · THE SAME FACE POINTS INWARD</p>`,
    coldtrap: `<div class="cold-sun"></div><div class="cold-rays"></div><div class="crater-shadow"></div><div class="crater-ground"></div><div class="cold-point"><i></i><strong>−249°C</strong><span>COLD POINT</span></div><p class="crater-rim-label">LOW SUNLIGHT HITS THE RIM</p><p class="diagram-caption">THE CRATER WALL BLOCKS LOW-ANGLE SUNLIGHT · THE FLOOR REMAINS IN SHADOW</p>`,
    tilted: `<div class="diagram-sun"></div><div class="diagram-orbit"></div><div class="diagram-earth"></div><div class="diagram-moon" style="left:13%;top:38%"></div><p class="diagram-caption">THE 5° TILT USUALLY CARRIES THE FULL MOON ABOVE OR BELOW EARTH'S SHADOW</p>`,
    impacts: `<div class="diagram-earth"></div><div class="diagram-moon"></div><i class="impact-dot" style="left:8%;top:18%"></i><i class="impact-dot" style="left:28%;top:29%"></i><i class="impact-dot" style="left:72%;top:18%"></i><i class="impact-dot" style="left:84%;top:68%"></i><p class="diagram-caption">SOME OBJECTS HIT THE MOON · MOST TRAJECTORIES NEVER COME CLOSE TO IT</p>`,
    daylight: `<div class="diagram-sun"></div><div class="diagram-moon"></div><p class="diagram-caption">REFLECTED SUNLIGHT FROM THE MOON CAN OUTSHINE THE BLUE DAYTIME SKY</p>`,
    "moon-words": `<div class="word-stack"><div class="word-row"><i class="word-moon waxing-word"></i><div><strong>WAXING</strong><span>WAX = GROW</span><b class="hebrew-word" lang="he" dir="rtl">מִתְמַלֵּא</b></div></div><div class="word-row"><i class="word-moon gibbous-word"></i><div><strong>GIBBOUS</strong><span>GIBBUS = HUMP</span><b class="hebrew-word" lang="he" dir="rtl">גַּבְנוּנִי</b></div></div><div class="word-row"><i class="word-moon waning-word"></i><div><strong>WANING</strong><span>WANE = FADE</span><b class="hebrew-word" lang="he" dir="rtl">מִתְמַעֵט</b></div></div></div><p class="word-memory">WAXING GIBBOUS = A HUMP GROWING TOWARD FULL</p>`,
    "solar-eclipse": `<div class="diagram-sun"></div><div class="eclipse-axis"></div><div class="eclipse-orbit"></div><div class="solar-shadow"></div><div class="diagram-earth"></div><div class="diagram-moon"></div><p class="diagram-caption" id="eclipseCaption">CROSSING THE SUN–EARTH LINE · THE SHADOW REACHES EARTH</p><div class="eclipse-controls"><button id="eclipseToggle" type="button" aria-pressed="false">SHOW 5° MISS</button></div>`,
    "lunar-eclipse": `<div class="diagram-sun"></div><div class="lunar-shadow"></div><div class="diagram-earth"></div><div class="diagram-moon"></div><p class="diagram-caption">SUN → EARTH → MOON · EARTH CASTS ITS SHADOW ON THE MOON</p>`
  };
  visual.innerHTML = diagrams[topic.visual];
  if (topic.visual === "collision") {
    const slider = document.querySelector("#originSlider");
    slider.addEventListener("input", updateOrigin);
    updateOrigin({ target: slider });
  }
  if (topic.visual === "solar-eclipse") {
    const button = document.querySelector("#eclipseToggle");
    button.addEventListener("click", updateSolarEclipse);
    updateSolarEclipse({ currentTarget: button, initialize: true });
  }
}

/** Move the collision origin marker to the user's pointer position. */
function updateOrigin(event) {
  const stageNumber = Number(event.target.value);
  const captions = [
    "A MARS-SIZED BODY APPROACHES THE YOUNG EARTH",
    "THE COLLISION MELTS AND VAPORIZES ROCK",
    "A HOT DEBRIS DISK FORMS AROUND GLOWING EARTH",
    "GRAVITY PULLS DEBRIS INTO A GROWING CLOUD",
    "THE MOON MAY HAVE FORMED OVER MONTHS OR YEARS"
  ];
  const visual = document.querySelector("#topicVisual");
  visual.dataset.stage = String(stageNumber);
  document.querySelector("#originCaption").textContent = captions[stageNumber];
}

/** Toggle the solar-eclipse diagram between alignment and a five-degree near-miss. */
function updateSolarEclipse(event) {
  const wasPressed = event.currentTarget.getAttribute("aria-pressed") === "true";
  const missesEarth = event.initialize ? false : !wasPressed;
  const visual = document.querySelector("#topicVisual");
  visual.dataset.alignment = missesEarth ? "miss" : "eclipse";
  event.currentTarget.setAttribute("aria-pressed", String(missesEarth));
  event.currentTarget.textContent = missesEarth ? "SHOW ECLIPSE" : "SHOW 5° MISS";
  document.querySelector("#eclipseCaption").textContent = missesEarth
    ? "ABOVE THE SUN–EARTH LINE · THE SHADOW MISSES EARTH"
    : "CROSSING THE SUN–EARTH LINE · THE SHADOW REACHES EARTH";
}

renderTopic(0);

// Reference the reusable dialog that presents Phase Atlas details.
const dialog = document.querySelector("#phaseDialog");

/** Open the detail dialog for a selected lunar phase. */
function openPhase(index) {
  const illumination = index <= 4 ? index / 4 : (8 - index) / 4;
  const shadowSize = Math.round(92 * (1 - illumination));
  const shadowX = index < 4 ? -Math.max(1, shadowSize) : Math.max(1, shadowSize);
  document.querySelector("#dialogNumber").textContent = `PHASE ${String(index + 1).padStart(2, "0")} · ${Math.round(illumination * 100)}% LIT`;
  document.querySelector("#dialogTitle").textContent = phaseNames[index];
  document.querySelector("#dialogDescription").textContent = phaseDescriptions[index];
  const moon = document.querySelector("#dialogMoon");
  moon.style.setProperty("--dialog-shadow-x", `${shadowX}px`);
  moon.style.setProperty("--dialog-shadow-size", shadowSize);
  if (!dialog.open) dialog.showModal();
}
document.querySelector("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});

/** Display a fact and synchronize its image, labels, and progress state. */
function showFact(index) {
  const totalSlides = facts.length * 2;
  state.fact = (index + totalSlides) % totalSlides;
  const factIndex = Math.floor(state.fact / 2);
  const pictureOnly = state.fact % 2 === 1;
  const [level, kicker, copy, sourceUrl, sourceName = "NASA"] = facts[factIndex];
  const card = document.querySelector(".fact-card");
  card.classList.toggle("picture-only", pictureOnly);
  card.classList.toggle("text-only", !pictureOnly);
  document.querySelector("#factLevel").textContent = level;
  document.querySelector("#factKicker").textContent = kicker;
  document.querySelector("#factCopy").textContent = copy;
  const factSource = document.querySelector("#factSource");
  factSource.href = sourceUrl;
  factSource.textContent = `Source: ${sourceName}`;
  const imageLabels = [
    "The Moon and Earth in a star field", "A close view of Tycho crater", "Galileo observing the Moon",
    "A playful smiling cratered Moon", "An Apollo-era astronaut on the lunar surface", "A mouse discovering the Moon is not cheese",
    "A full Moon reflected in a mountain lake", "Eight Moon phases orbiting Earth", "The Moon's influence on Earth's ocean tides"
  ];
  const picture = document.querySelector("#factImage");
  if (pictureOnly) {
    const imageIndex = factIndex === 6 ? 8 : factIndex % 9;
    picture.style.backgroundImage = `url("${factImagePaths[imageIndex]}")`;
    picture.setAttribute("aria-label", imageLabels[imageIndex]);
  }
  document.querySelector("#factCounter").textContent = `${String(state.fact + 1).padStart(2, "0")} / ${totalSlides}`;
  document.querySelector("#factProgress").style.width = `${((state.fact + 1) / totalSlides) * 100}%`;
}

document.querySelectorAll(".mode-button").forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.mode)));
document.querySelector("#prevFact").addEventListener("click", () => navigateFact(-1));
document.querySelector("#nextFact").addEventListener("click", () => navigateFact(1));

let factTimer;
/** Restart the timer that automatically advances the active fact. */
function resetFactTimer() {
  clearTimeout(factTimer);
  factTimer = setTimeout(() => {
    showFact(state.fact + 1);
    resetFactTimer();
  }, 9000);
}

/** Move through the fact sequence in either direction with wrapping. */
function navigateFact(direction) {
  clearTimeout(factTimer);
  showFact(state.fact + direction);
  resetFactTimer();
}
document.querySelector("#soundToggle").addEventListener("click", (event) => {
  state.sound = !state.sound;
  event.currentTarget.textContent = state.sound ? "SOUND ON" : "SOUND OFF";
  event.currentTarget.setAttribute("aria-pressed", state.sound);
  event.currentTarget.setAttribute("aria-label", state.sound ? "Turn sound off" : "Turn sound on");
  const player = document.querySelector("#musicPlayer");
  player.contentWindow?.postMessage(JSON.stringify({
    event: "command",
    func: state.sound ? "playVideo" : "pauseVideo",
    args: []
  }), "*");
});

document.querySelector("#hemisphereToggle").addEventListener("click", event => {
  state.hemisphere = state.hemisphere === "south" ? "north" : "south";
  const south = state.hemisphere === "south";
  document.body.classList.toggle("southern-view", south);
  event.currentTarget.textContent = `HEMISPHERE · ${south ? "S" : "N"}`;
  event.currentTarget.setAttribute("aria-label", `Switch to ${south ? "Northern" : "Southern"} Hemisphere view`);
  draw();
});

window.addEventListener("keydown", event => {
  if (state.mode !== "orbit" || !["ArrowLeft", "ArrowRight", "Enter"].includes(event.key)) return;
  event.preventDefault();
  if (event.key === "Enter") {
    state.autoOrbit = !state.autoOrbit;
    keyboardHint.querySelector("span:nth-child(2)").textContent = state.autoOrbit ? "AUTO ORBIT · ENTER TO PAUSE" : "ARROWS · ENTER FOR AUTO ORBIT";
    return;
  }
  state.autoOrbit = false;
  state.orbitAngle += event.key === "ArrowRight" ? .11 : -.11;
  draw();
});

// Track pointer dragging while the user manually controls the orbit.
let dragging = false;
stage.addEventListener("pointerdown", event => {
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (state.mode === "atlas") {
    const hit = state.points.find(p => Math.hypot(p.x - x, p.y - y) < p.r);
    if (hit) openPhase(phaseNames.indexOf(hit.name));
  } else {
    dragging = true;
    state.autoOrbit = false;
    stage.setPointerCapture(event.pointerId);
  }
});
stage.addEventListener("pointermove", event => {
  const rect = stage.getBoundingClientRect();
  if (dragging && state.mode === "orbit") {
    state.orbitAngle += event.movementX * .012;
    draw();
  }
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const hit = state.points.find(p => Math.hypot(p.x - x, p.y - y) < p.r);
  tooltip.classList.toggle("show", Boolean(hit));
  if (hit) {
    tooltip.textContent = hit.name;
    tooltip.style.left = `${hit.x}px`;
    tooltip.style.top = `${hit.y}px`;
  }
});
stage.addEventListener("pointerup", () => dragging = false);
stage.addEventListener("pointerleave", () => { dragging = false; tooltip.classList.remove("show"); });

window.addEventListener("resize", resize);
showFact(0);
resize();
resetFactTimer();

/** Advance automatic motion and schedule the next animation frame. */
function animate(time) {
  if (state.autoOrbit && state.mode === "orbit") {
    const delta = Math.min(40, time - (state.lastFrame || time));
    state.orbitAngle += delta * .00045;
    draw();
  }
  state.lastFrame = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

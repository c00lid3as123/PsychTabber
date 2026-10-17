# Everything in PsychTabber, explained

Written by AI, like the rest of this project. If something here doesn't match what you see on screen, trust what you see. Effect names and what they do are based on reading the code, but how they *look* depends on the page, the sliders and your screen.

**Important:** PsychTabber is an artistic visual filter. It does not reproduce or simulate any real drug or mental state, and preset names are only artistic labels. See [DISCLAIMER.md](../DISCLAIMER.md).

## The side panel, top to bottom

| Screenshot 1 | Screenshot 2 | Screenshot 3 | Screenshot 4 |
|---|---|---|---|
| ![top of the panel](img/panel-1-top.jpg) | ![camera and cut-outs](img/panel-2-camera-and-cutouts.jpg) | ![effects list](img/panel-3-effects.jpg) | ![performance](img/panel-4-performance.jpg) |

### Start on this tab
The big purple button starts or stops PsychTabber on the tab you are looking at. Pressing it again stops everything. This is the most reliable way to stop, along with clicking the toolbar icon or closing the tab.

### Presets
- **Preset:** a dropdown of ready-made mixes of effect sliders (listed below), plus any you saved.
- **Save current as:** type a name and press **Save** to keep your current sliders. **Delete** removes the selected one of yours.
- **Export… / Export all mine / Import…:** save presets as a `.json` file to share or back up, and load them again. Exported files contain only slider values and settings.

### Master
- **Filter on:** turns all effects on or off without losing your slider positions.
- **Overall strength:** one slider that scales every effect up or down. **Start low.**
- **Animation speed:** how fast things move and change.
- **Bright-page comp.:** eases down white and very bright pages so effects stay visible instead of washing out to white. At 0 you get the unmodified look.
- **Auto-drift effects:** lets the effect strengths wander on their own.
- **All effects off:** sets every effect slider to zero.
- **Randomize:** picks a random mix. It can be intense.

### Camera feedback
This makes the screen look like an old video camera filming its own screen, which creates echoes, tunnels and trails. It needs the **Full shader** display mode.
- **Feedback on:** turns the camera feedback loop on.
- **3D camera view:** a small scene with a monitor and a camera on a tripod. Moving this camera changes the real effect. Drag to aim, right-drag or Shift-drag to move, Alt-drag to roll, mouse wheel to zoom the lens, Ctrl or Shift + wheel to move closer or farther, double-click to reset. **Reset camera** also resets it.
- **Echoes (25 = endless):** how many ghost copies you see. Higher means they fade more slowly, up to endless.
- **Feedback strength:** how much of the previous picture is mixed back in.
- **Zoom per pass:** each echo is a little smaller or larger than the last, which makes tunnels.
- **Rotation per pass (°):** each echo is turned a little, which makes spirals.
- **Shift X / Shift Y:** each echo slides sideways or up and down.
- **Lens softness:** blurs each echo like a soft lens.
- **Glow / halation:** adds a soft bloom around bright areas.
- **Colour fringe:** splits red, green and blue slightly, like a cheap lens.
- **Hue shift per pass (°):** each echo shifts colour, so the tunnel cycles through the rainbow.
- **Colour build-up:** how strongly colours intensify as echoes stack.
- **Screen curve + vignette:** rounded, curved screen corners and darkened edges.
- **Sensor grain:** adds camera-style noise.
- **Movement speed** and **Camera movement:** the camera moves on its own. Choices are None, Handheld, Breathe, Spiral, Orbit, Sway, Dutch roll, Figure-eight and Drift.
- **Camera keys on/off (Alt+Shift+C):** lets you move the camera with the keyboard while the page is focused. Arrow keys or numpad 8/4/6/2 move, **+** and **-** roll, **PgUp/PgDn** zoom, **Shift** is faster, **R** or numpad 5 resets. While on, the arrow keys don't scroll the page.

### See-through cut-outs
Makes parts of the screen transparent so the feedback shows through them.
- **Chroma key on / Key colour / Pick:** one colour becomes see-through (like a green screen). **Pick** is an eyedropper. **Key tolerance** is how close a colour must be to count, and **Key softness / edge feather** softens the edge.
- **Draw cut-out on page / Undo last / Clear all:** drag rectangles on the page to make windows (up to 6).

### Effects (36 sliders)
Each effect has a tick box (on/off) and a slider (how strong). They stack, so try a few at a time.

**Movement and warping**
- **Breathing:** the whole picture slowly swells and shrinks, with gentle ripples.
- **Warp flow:** the picture wobbles and flows as if seen through moving water.
- **Texture crawl:** surfaces shimmer and crawl with tiny movements.
- **Melting:** the picture sags downward in slow waves.
- **Lens swell:** the picture bulges and relaxes like a pulsing fisheye lens.
- **Swirl vortices:** two drifting whirlpools twist the image around themselves.
- **Spirals & tunnels:** the picture twists around the centre, with pulsing spiral rings.

**Geometry and mirrors**
- **Kaleidoscope:** the picture is cut into mirrored wedges. More slider means more wedges.
- **Fractal folding:** the picture is folded back on itself repeatedly into self-similar shapes.
- **Mirror world:** the picture becomes left-right symmetrical.
- **Tile echo:** the picture repeats in mirrored tiles, like a hall of mirrors.
- **Prism facets:** the picture breaks into small shifted cells, like stained glass.
- **Lattice patterns:** a grid or honeycomb pattern of light and colour spreads across the screen.
- **Cobweb:** thin radial and circular lines overlay the picture.

**Colour and light**
- **Color drift:** colours become richer and slowly cycle through the rainbow.
- **Spectral cycling:** colours are remapped by brightness and slowly rotate through the spectrum.
- **Tint split:** highlights and shadows take opposite colours, which slowly shift.
- **Thermal vision:** colours are replaced by a heat-camera palette based on brightness.
- **Solarize:** part of the brightness range is inverted, with the cut-off slowly drifting.
- **Glow:** bright areas bloom.
- **Dream haze:** a soft, diffuse blur blended into the picture.
- **Edge auras:** outlines gain a rainbow glow.
- **Organic veins:** glowing vein or marble-like patterns spread across the screen.
- **Plasma in shadows:** colourful plasma swirls appear in the dark parts only.
- **Light streaks:** bright highlights smear sideways into streaks.

**Patterns and visions**
- **Patterns:** coloured geometric patterns follow edges and detail and shift over time.
- **Eyes (DeepDream style):** a faint grid of eye shapes opens and closes across the picture.
- **Ripple interference:** two sets of ripples cross each other and change the brightness.
- **Brightness waves:** slow diagonal waves of lighter and darker.
- **Tunnel vignette:** the edges darken in a pulsing tunnel.
- **Double vision:** a ghost second copy drifts around the picture.
- **Chromatic split:** red, green and blue drift apart toward the edges.
- **Detail boost:** sharpens edges and fine texture.
- **Visual snow:** fine flickering grain, like static.

**Trails**
- **Trails:** moving things leave fading ghost trails.
- **Recursion:** the previous picture is mixed back in slightly shrunk and turned, which makes repeating tunnels.

*Hidden effects:* the code also contains 10 glitch effects (slice tearing, datamosh blocks, RGB shift bursts, CRT scanlines, pixelate, posterize banding, VHS wobble, GPU artifacts, signal dropout, pixel stretch). They are switched off and hidden in this edition so that saved presets stay compatible.

### Performance
- **Render scale (100%, 75%, 50%, 35%):** how sharp the effect picture is. Lower is much lighter on your graphics card and battery.
- **Frame rate cap (15, 24, 30, 60):** the maximum frames per second. Lower is lighter.
- **Display:** **Full shader (all effects)** uses Chrome's screen sharing prompt (you choose *Share this tab*) and gives the full look including camera feedback. **Reduced (no capture, always works)** is a simpler version with fewer effects that needs no prompt.

### Diagnostics
A text box that shows what happened when starting. If the full shader fails, the reason appears here. Include it if you report a problem.

## Built-in presets
Each is just a mix of the sliders above. They are artistic looks, not simulations of anything real.
- **Light** and **Gentle Come-Up:** mild, good for a first try.
- **LSD, Mushrooms, Deep Dream, Kaleidoscope Trip, Breathing Walls, Closed-Eye Visuals, Mushroom Forest, Cosmic Mandala, Liquid Melt, Neon Dream, Crystal Prism, Synesthesia Pulse, Thermal Hallucination:** themed mixes of colour, warping, patterns and trails.
- **Overwhelming:** many effects at high strength. It is very intense, so try the gentler ones first.
- **Off:** everything at zero.

## How to stop it
Press **Start/Stop** at the top of the side panel, click the PsychTabber toolbar icon, or close or reload the tab. Keyboard shortcuts are experimental and may not work on every computer, so do not rely on them.

(() => { 
    // Get layers and assign a strength value to each one.
    // strength is in pixels of offset at the screen edges.
    const layers = [
        { el: document.getElementById('layer-1'), strength: 12 }, // far/back (moves least)
        { el: document.getElementById('layer-2'), strength: 16 },
        { el: document.getElementById('layer-3'), strength: 20 },
        { el: document.getElementById('layer-4'), strength: 24 },
        { el: document.getElementById('layer-5'), strength: 40 }
    ].filter(obj => obj.el) //Guard if getElement returns null.

if (!layers.length) return; // nothing to animate

// 3. Tell GSAP to 'own' the transform positioning.
// Your CSS centers each image with translate(-50%, -50%).
// In GSAP terms, that's xPercent/yPercent = -50.
// This keeps the image centered while we add extra x/y offsets for the parallax.
  layers.forEach(({ el }) => {
    gsap.set(el, { xPercent: -50, yPercent: -50, force3D: true });
  });

// 4) Make fast tweening functions for x and y on each layer.
// quickTo returns a SETTER that animates to whatever value you pass next.
// Every time you call it, GSAP smoothly eases from the *current* position to the new one.
const movers = layers.map(({ el }) => ({
    x: gsap.quickTo(el, "x", { duration: 0.2, ease: "power3.out"}),
    y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" })
}))

//MAIN TWEENING FUNCTION !
// 4) Make fast tweening functions for x and y on each layer.
// quickTo returns a SETTER that animates to whatever value you pass next.
// Every time you call it, GSAP smoothly eases from the *current* position to the new one.
function onMove(e) {
    const cx = window.innerWidth /2;
    const cy = window.innerHeight /2;
    const relX = (e.clientX - cx) / cx // -1 (left)  .. 0 (center) .. 1 (right)
    const relY = (e.clientY - cy) / cy; // -1 (up)   .. 0 (center) .. 1 (down)

    // For parallax, layers usually move opposite the cursor (feels “deep”).
    layers.forEach(({ strength }, i) => {
        const moveX = -relX * strength;
        const moveY = -relY * strength;
        movers[i].x(moveX); // animate toward this x
        movers[i].y(moveY); // animate toward this y
    });
}

// 6) When the mouse leaves the area, return all layers to center (0,0 offsets).
  function onLeave() {
    movers.forEach(m => {
      m.x(0);
      m.y(0);
    });
  }

// 7) Hook up events on the area you want responsive.
// Using pointer events works for mouse + pen + (optionally) touch.
const container = document.querySelector('.inner') || window;
container.addEventListener('pointermove', onMove);
container.addEventListener('pointerleave', onLeave);

})();
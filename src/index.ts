console.log("index.ts loaded");

/**
 * The last time {@link run} was called. Used to determine whether {@link animate} should be called.
 */
let last = performance.now() / 1000;
/**
 * The fps threshold. Used to determine whether {@link animate} should be called.
 */
let fpsThreshold = 0;

/**
 * The root pendulum. (never visible, just a dummy for the pendulum tree)
 */
let pendulum: Pendulum;

// Events
window.wallpaperPropertyListener = {
    applyGeneralProperties: function(properties: Partial<GeneralSettings>) {
        console.log("applyGeneralProperties", properties);
        if (properties.fps) settings.fps = properties.fps;
    },
    applyUserProperty: function(properties: Partial<UserSettings>) {
        console.log("applyGeneralProperties", properties);
        if (properties.pendulum_count) {
            settings.pendulum_count = properties.pendulum_count;
            refreshPendulums();
        }
    },
}
window.onload = function() {
    console.log("window.onload");
    window.requestAnimationFrame(run);
    refreshPendulums();
}
window.onresize = function(event) {
    pendulum.updateSize();
}
window.onkeydown = function(event) {
    console.log(event.key);
    if (event.key == "r") {
        refreshPendulums();
    }
}

// Animation
/**
 * Called each frame.
 */
function run() {
    // Keep animating
    window.requestAnimationFrame(run);

    // Figure out how much time has passed since the last animation
    var now = performance.now() / 1000;
    var dt = Math.min(now - last, 1);
    last = now;

    // If there is an FPS limit, abort updating the animation if we have reached the desired FPS
    if (settings.fps > 0) {
        fpsThreshold += dt;
        if (fpsThreshold < 1.0 / settings.fps) {
            return;
        }
        fpsThreshold -= 1.0 / settings.fps;
    }

    // FPS limit not reached, draw animation!
    animate();
}
/**
 * Updates the animation.
 */
function animate() {
    pendulum.draw(new TransformationMatrix());
}

/**
 * Refreshes the pendulums.
 */
function refreshPendulums(): void {
    if (pendulum) pendulum.destroy();
    pendulum = generatePendulumTree();
}
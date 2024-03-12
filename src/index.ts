console.log("index.ts loaded");

declare interface Window {
    wallpaperPropertyListener : any;
}

let last = performance.now() / 1000;
let fpsThreshold = 0;

// Events
window.wallpaperPropertyListener = {
    applyGeneralProperties: function(properties: Partial<ISettings>) {
        console.log("applyGeneralProperties", properties);
        if (properties.fps) wallpaperSettings.fps = properties.fps;
    },
}
window.onload = function() {
    console.log("window.onload");
    window.requestAnimationFrame(run);
}

// Animation
function run() {
    // Keep animating
    window.requestAnimationFrame(run);

    // Figure out how much time has passed since the last animation
    var now = performance.now() / 1000;
    var dt = Math.min(now - last, 1);
    last = now;

    // If there is an FPS limit, abort updating the animation if we have reached the desired FPS
    if (wallpaperSettings.fps > 0) {
        fpsThreshold += dt;
        if (fpsThreshold < 1.0 / wallpaperSettings.fps) {
            return;
        }
        fpsThreshold -= 1.0 / wallpaperSettings.fps;
    }

    // FPS limit not reached, draw animation!
    animate();
}
function animate() {
    console.log("animate");
}
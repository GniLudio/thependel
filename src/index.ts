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

/**
 * The canvas.
 */
let canvas: HTMLCanvasElement;

/**
 * The last time when {@link animate} was called. 
 */
let lastAnimate: number = performance.now() / 1000;

/**
 * The duration of the current animation. Reset by {@link refreshPendulums}.
 */
let animationDuration: number;

// Events
window.wallpaperPropertyListener = {
    applyGeneralProperties: function(properties: Partial<GeneralSettings>) {
        console.log("applyGeneralProperties", properties);
        if (properties.fps) settings.fps = properties.fps;
    },
    applyUserProperty: function(properties: Partial<UserSettings>) {
        console.log("applyGeneralProperties", properties);
        if (properties.pendulum_count) settings.pendulum_count = properties.pendulum_count;
        if (properties.refreshInterval) settings.refreshInterval = properties.refreshInterval;
        if (properties.initialDuration) settings.initialDuration = properties.initialDuration;
        if (properties.hideAuthor) settings.hideAuthor = properties.hideAuthor;
        if (properties.hideRepo) settings.hideRepo = properties.hideRepo;

        if (properties.pendulum_count) refreshPendulums();
    },
}
window.onload = function() {
    console.log("window.onload");
    setupCanvas();
    updateFooter();
    refreshPendulums();
    window.requestAnimationFrame(run);
}
window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
    const now = performance.now() / 1000;
    const dt = Math.min(now - last, 1);
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
function animate(deltaTime: number = Math.min((performance.now() - lastAnimate) / 1000, 1)) {
    if (animationDuration > settings.refreshInterval) {
        refreshPendulums();
    }

    console.log("animate", deltaTime)

    // cartesias coordinate system with origin at center
    const context = canvas.getContext("2d")!;
    context.save();
    context.translate(0, canvas.height);
    context.scale(1, -1); // TODO: Remove
    context.translate(canvas.width/2, canvas.height/2);

    const matrix = new TransformationMatrix();
    pendulum.draw(matrix, deltaTime);
    animationDuration += deltaTime;

    context.restore();
    lastAnimate = performance.now();
}

/**
 * Refreshes the pendulums.
 */
function refreshPendulums(): void {
    console.log("refreshPendulums")

    const start = performance.now();
    pendulum = generatePendulumTree();
    animationDuration = 0;

    const context = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const deltaTime = 1 / settings.fps;
    while (animationDuration < settings.initialDuration) {
        animate(deltaTime);
    }


}

/**
 * Sets up the canvas.
 */
function setupCanvas(): void {
    canvas = document.querySelector("canvas")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Updates the footer.
 */
function updateFooter(): void {
    const author = document.getElementById("author")!;
    author.style.display = settings.hideAuthor ? "none" : "block";
    const repo = document.getElementById("repo")!;
    repo.style.display = settings.hideRepo ? "none" : "block";
}

/**
 * Converts a color to css string.
 * @param color The color.
 * @returns The css string.
 */
function convertColorToStr(color: Color): string {
    const temp = color.map(x => Math.ceil(x * 255)); 
    return `rgb(${temp[0]}, ${temp[1]}, ${temp[2]})` 
}
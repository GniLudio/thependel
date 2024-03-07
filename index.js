console.log("index.js loaded");

/**
 * The drawing canvas.
 * @type HTMLCanvasElement
 */
let canvas;
/**
 * The drawing context.
 * @type CanvasRenderingContext2D
 */
let context;

/**
 * The pendulum.
 * @type Pendulum
 */
const rootPendulum = new Pendulum(300, 180, 0, 50, "#FF0000", undefined, undefined, 
    new Pendulum(50, 0, 0, 25, "#00FF00")
)

/**
 * The pendulum for which the settings are open.
 */
let openedPendelum = undefined;

/**
 * The last time the pendulum was updated.
 */
let time;

/**
 * Whether the animation is paused.
 */
let paused;


// event listeners
document.addEventListener("DOMContentLoaded", () => { 
    // gets the canvas
    canvas = document.querySelector("canvas");
    refreshCanvas();
    // sets the initial time
    time = document.timeline.currentTime;
    // setup refresh button
    getRefreshButton().onclick = refreshCanvas;
    // buttons for opening the settings
    for (let pendulum = rootPendulum; pendulum != undefined; pendulum = pendulum.nestedPendulum) {
        setupPendulum(pendulum);
    }
    // setup settings
    const settings = [
        ["length", "input", element => Number(element.value), value => getPendulum(openedPendelum).length = value],
        ["degrees", "input", element => Number(element.value), value => getPendulum(openedPendelum).degrees = value],
        ["rotationSpeed", "input", element => Number(element.value), value => getPendulum(openedPendelum).rotationSpeed = value],
        ["size", "input", element => Number(element.value), value => getPendulum(openedPendelum).size = value],
        ["color", "input", element => element.value, value => getPendulum(openedPendelum).color = value],
        ["clockwise", "change", element => element.checked, value => getPendulum(openedPendelum).clockwise = value],
        ["passRotation", "change", element => element.checked, value => getPendulum(openedPendelum).passRotation = value],
    ]
    for (const [id, eventName, getter, setter] of settings) {
        const element = getSettingInput(id);
        element.addEventListener(eventName, _ => setter(getter(element)));
        element.addEventListener(eventName, refreshCanvas);
        console.log(id, eventName, getter, setter, element);
        element.addEventListener("mouseup", _ => requestAnimationFrame(refreshCanvas));
    }
    // starts animation
    animate();
});
window.addEventListener("resize", refreshCanvas);

function refreshCanvas() {
    // sets the canvas size
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    // gets the drawing context and 
    context = canvas.getContext && canvas.getContext("2d");
    // clear
    context.clearRect(0,0, canvas.width, canvas.height);
    // fill with white
    context.fillStyle = "white";
    context.fillRect(0,0, canvas.width, canvas.height);
    context.lineCap = "round";
}

function setupPendulum(pendulum) {
    const element = document.createElement("li");
    element.classList.add("list-group-item");
    getButtonList().insertBefore(element, getAddButton());
    const i = Array.from(getButtonList().children).indexOf(element) - 1;

    const button = document.createElement("button");
    button.classList.add("btn");
    element.appendChild(button);
    button.onclick = () => toggleSettings(i);

    const text = document.createTextNode(`Pendulum ${getButtonList().childElementCount-2}`);
    button.appendChild(text);

    for (const child of getButtonList().children) {
        if (child != getAddButton() && child!=getRefreshButton()) {
            child.style.width = (100 / (getButtonList().childElementCount-2)) + "%";
        }
    }
}
/**
 * Animates the pendulum.
 * @param {MouseEvent} event 
 */
function animate() {
    // calculates deltaTime since last animate
    const deltaTime = (document.timeline.currentTime - time) / 1000;
    // saves context
    context.save();
    // cartisian coordinate system
    context.translate(0, canvas.height);
    context.scale(1,-1);

    // center is (0,0)
    context.translate(canvas.width/2, canvas.height/2);
    // animate the pendulums
    if (!paused) {
        rootPendulum.draw(context, new TransformationMatrix(), deltaTime);
    }
    // resets the context
    context.restore();
    // store time for deltaTime
    time = document.timeline.currentTime;
    requestAnimationFrame(animate);
}

/**
 * Toggles the settings for a pendulum.
 * * Opens, if settings for the pendulum wasn't already open.
 * * Otherwise, close settings.
 * @param {number} i The pendulum index.
 */
function toggleSettings(i) {
    // deactives previous pendulum button
    if (openedPendelum != undefined) {
        getPendulumLi(openedPendelum).firstChild.classList.remove("active");
    }
    // open, if settings for the pendulum wasn't already open
    if (openedPendelum != i) {
        openedPendelum = i;
        getSettings().classList.remove("collapse");
        getCanvas().style.opacity = "0.9";
        getPendulumLi(i).firstChild.classList.add("active");

        // updates the ui values
        getSettingInput("length").value = getPendulum(openedPendelum).length;
        getSettingInput("degrees").value = getPendulum(openedPendelum).degrees;
        getSettingInput("rotationSpeed").value = getPendulum(openedPendelum).rotationSpeed;
        getSettingInput("size").value = getPendulum(openedPendelum).size;
        getSettingInput("color").value = getPendulum(openedPendelum).color;
        getSettingInput("clockwise").checked = getPendulum(openedPendelum).clockwise;
        getSettingInput("passRotation").checked = getPendulum(openedPendelum).passRotation;
    } else {
        openedPendelum = undefined;
        getSettings().classList.add("collapse");
        getCanvas().style.opacity = "1";
    }
}

/**
 * Returns the i-th pendulum. (0 to n-1)
 * @param {number} i The index.
 * @returns The pendulum.
 */
function getPendulum(i) {
    let pendulum = rootPendulum;
    while (i > 0) {
        pendulum = pendulum.nestedPendulum;
        i--;
    }
    return pendulum;
}
/**
 * Gets the HTML element of the i-th pendulum in the button list.
 * @param {number} i The index. 
 * @returns The HTML element.
 */
function getPendulumLi(i) { return getButtonList().children[i+1]; }
/**
 * Returns the HTML element for refreshing the canvas.
 * @returns The button.
 */
function getRefreshButton() { return document.getElementById("RefreshButton");}
/**
 * Returns the HTML element for adding new pendulums.
 * @returns The button.
 */
function getAddButton() { return document.getElementById("AddButton"); }
/**
 * Returns the button list.
 * @returns The button list.
 */
function getButtonList() {return document.getElementById("ButtonList");}
/**
 * Returns the canvas.
 * @returns The canvas.
 */
function getCanvas() { return document.getElementsByTagName("canvas")[0]; }
/**
 * Returns the settings div.
 * @returns The settings div.
 */
function getSettings() { return document.getElementById("Settings");}

/**
 * Gets the input element of a pendulum setting.
 * @param {string} id The id. 
 * @returns The input element.
 */
function getSettingInput(id) { return document.getElementById(id).querySelector("input"); }
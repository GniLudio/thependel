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
 * The root pendulum.
 * @type Pendulum
 */
let rootPendulum;

/**
 * The initial pendulum count.
 */
const pendulumCount = 10;

/**
 * The pendulum for which the settings are open.
 * @type {number | undefined}
 */
let openedPendelum = undefined;

/**
 * The last time the animation was updated.
 * @type {number}
 */
let time;

/**
 * Whether the animation is paused.
 * @type {boolean}
 */
let paused = false;

/**
 * All settings.
 * @type {[
 *  id: string, 
 *  eventName: string, 
*   getInputValue: (inputElement: HTMLElement) => unknown, 
*   setInputValue: (inputElement: HTMLElement, value: unknown) => void,
 * ][]}
 */
const settings = [
    ["length", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = value],
    ["size", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = value],
    ["rotationSpeed", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = value],
    ["angle", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = roundToDecimal(value, 2)],
    ["lengthAmplitude", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = value],
    ["lengthFrequency", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = value],
    ["sizeAmplitude", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = value],
    ["sizeFrequency", "input", inputElement => Number(inputElement.value), (inputElement, value) => inputElement.value = value],
    ["clockwise", "change", inputElement => inputElement.checked, (inputElement, value) => inputElement.checked = value],
    ["color", "input", e => e.value, (e,v) => e.value = v],
    ["nestedRotation", "change", inputElement => inputElement.checked, (inputElement, value) => inputElement.checked = value],
    ["visible", "change", inputElement => inputElement.checked, (inputElement, value) => inputElement.checked = value],
];

// setup events
document.addEventListener("DOMContentLoaded", event => { 
    // gets the canvas
    canvas = document.querySelector("canvas");
    // gets the drawing context and 
    context = canvas.getContext && canvas.getContext("2d");
    // updates the size
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    // clears the canvas
    clearCanvas();
    // sets the initial time
    time = document.timeline.currentTime;
    // setup refresh button
    getRefreshButton().onclick = _ => clearCanvas();
    getRemoveButton().onclick = _ => removePendulum();
    getAddButton().onclick = _ => addPendulum();
    
    // setup pendulums
    for (let i=0; i<pendulumCount; i++) {
        addPendulum();
    }
    // setup settings
    for (const [id, eventName, getInputValue, setInputValue] of settings) {
        const inputElement = getSettingInput(id);
        inputElement.addEventListener(eventName, _ => {
            const value = getInputValue(inputElement);
            const pendulum = getPendulum(openedPendelum);
            pendulum[id] = value;
        });
    }
    // starts animation
    animate();
});
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    clearCanvas();
});
// setup keyboard events
document.addEventListener("keydown", event => {
    // F5 - clears the canvas
    if (event.key == "F5") {
        if (!event.shiftKey) {
            let lastPendulum = rootPendulum;
            while (lastPendulum.nestedPendulum != undefined) {
                lastPendulum.refresh();
                lastPendulum = lastPendulum.nestedPendulum;
            }
        }
        requestAnimationFrame(clearCanvas);
        updateSettings();
        event.preventDefault();
    }
    // 1-9 - Toggles the settings.
    else if (["1","2","3","4","5","6","7","8","9"].includes(event.key)) {
        const i = Number.parseInt(event.key) - 1;
        toggleSettings(i);
    }
    // Esc - Closes the settings
    else if (event.key == "Escape" && openedPendelum!=undefined) {
        toggleSettings(openedPendelum);
    } 
    else if (event.key == "+") {
        addPendulum();
    }
    else if (event.key == "-") {
        let lastPendulum = rootPendulum;
        let i = 0;
        while (lastPendulum.nestedPendulum != undefined) {
            lastPendulum = lastPendulum.nestedPendulum;
            i++;
        }
        removePendulum(i);
    }
    else if (event.key == " ") {
        paused = !paused;
        document.title = !paused ? "The Pendulum" : "The Pendulum (Paused)";
    }
});

/**
 * Animates the pendulum.
 */
function animate() {
    // calculates deltaTime since last animate
    const deltaTime = (document.timeline.currentTime - time) / 1000;
    if (!paused) {
        // saves context
        context.save();
        // cartisian coordinate system
        context.translate(0, canvas.height);
        context.scale(1,-1);

        // center is (0,0)
        context.translate(canvas.width/2, canvas.height/2);
        
        // animate the pendulums
        rootPendulum.draw(context, new TransformationMatrix(), deltaTime);
        // resets the context
        context.restore();
        // store time for deltaTime
    }

    time = document.timeline.currentTime;
    requestAnimationFrame(animate);
}

/**
 * Clears the canvas.
 */
function clearCanvas() {
    // clear
    context.clearRect(0,0, canvas.width, canvas.height);
    // fill with white
    context.fillStyle = "white";
    context.fillRect(0,0, canvas.width, canvas.height);
    context.lineCap = "round";
}

/**
 * Toggles the settings for a pendulum.
 * * Opens, if settings for the pendulum wasn't already open.
 * * Otherwise, close settings.
 * @param {number} i The pendulum index.
 */
function toggleSettings(i) {
    if (getPendulum(i) == undefined) {
        return;
    }
    // deactives previous pendulum button
    if (openedPendelum != undefined && getPendulum(openedPendelum) != undefined) {
        getPendulumLi(openedPendelum).firstChild.classList.remove("active");
    }
    // open, if settings for the pendulum wasn't already open
    if (openedPendelum != i) {
        openedPendelum = i;
        getSettings().classList.remove("collapse");
        getCanvas().style.opacity = "0.9";
        getPendulumLi(i).firstChild.classList.add("active");

        // updates the ui values
        for (const [id, _, getInputValue, setInputValue] of settings) {
            const inputElement = getSettingInput(id);
            const value = getPendulum(openedPendelum)[id];
            console.log(id, value);
            setInputValue(inputElement, value);;
            const outputElement = getSettingOutput(id);
            if (outputElement) outputElement.innerHTML = getInputValue(inputElement);
        }
    } else {
        openedPendelum = undefined;
        getSettings().classList.add("collapse");
        getCanvas().style.opacity = "1";
    }
}

/**
 * Opens the opened settings.
 */
function updateSettings() {
    if (openedPendelum != undefined) {
        const i = openedPendelum;
        toggleSettings(i);
        toggleSettings(i);
    }

}

/**
 * Adds a pendulum;
 */
function addPendulum() {
    const pendulum = new Pendulum();
    if (rootPendulum == undefined) {
        rootPendulum = pendulum;
    } else {
        let lastPendulum = rootPendulum;
        while (lastPendulum.nestedPendulum != undefined) {
            lastPendulum = lastPendulum.nestedPendulum;
        }
        lastPendulum.nestedPendulum = pendulum;
    }

    const element = document.createElement("li");
    element.classList.add("list-group-item");
    getButtonList().insertBefore(element, getAddButton());
    const i = Array.from(getButtonList().children).indexOf(element) - 1;

    const button = document.createElement("button");
    button.classList.add("btn");
    element.appendChild(button);

    updatePendulumButtons();
}

/**
 * Removes the i-th pendulum.
 * @param {number} i 
 */
function removePendulum(i = openedPendelum) {
    if (i == undefined) return;
    if (getPendulum(i) == undefined) return;

    // removes the pendulum
    if (i == 0) {
        if (rootPendulum.nestedPendulum == undefined) {
            rootPendulum = new Pendulum();
            updateSettings();
            return;
        } else {
            rootPendulum = rootPendulum.nestedPendulum;
        }
    } else {
        let previousPendulum = undefined;
        let pendulum = rootPendulum;
        for (let j=0; j<i; j++) {
            previousPendulum = pendulum;
            pendulum = pendulum.nestedPendulum;
        }
        previousPendulum.nestedPendulum = pendulum.nestedPendulum;
    }

    getPendulumLi(i).remove();
    updatePendulumButtons();

    if (openedPendelum == i) {
        if (i == 0) {
            updateSettings();
        } else {
            toggleSettings(i-1);
        }
    }
}

/**
 * Updates the names and events of the pendulum buttons.
 */
function updatePendulumButtons() {
    const all_buttons = Array.from(getButtonList().children);
    const pendulum_buttons = getPendulumList();
    for (const child of all_buttons) {
        child.style.width = (100 / all_buttons.length) + "%";
    }
    for (const [i, child] of pendulum_buttons.entries()) {
        const button = child.querySelector("button");
        button.onclick = () => toggleSettings(i);
        button.innerHTML = i+1;
    }
}

/**
 * Returns the i-th pendulum. (0 to n-1)
 * @param {number} i The index.
 * @returns The pendulum.
 */
function getPendulum(i) {
    let pendulum = rootPendulum;
    while (i > 0 && pendulum != undefined) {
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
 * Gets HTML elements of all pendulums in the button list. 
 * @returns The HTML elements.
 */
function getPendulumList() {
    return Array.from(getButtonList().children).slice(1, -1);
}
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

/**
 * Gets the output element of a pendulum setting.
 * @param {*} id The id.
 * @returns The output element.
 */
function getSettingOutput(id) { return document.getElementById(id).querySelector("output");}

/**
 * Gets the remove button.
 * @returns The remove button.
 */
function getRemoveButton() { return document.getElementById("remove").querySelector("button"); }
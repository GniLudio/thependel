console.log("math.js loaded");

/**
 * Returns a random number between a minimum and a maximum.
 * @param {number} min The minimum.
 * @param {number} max The maximum.
 * @returns The number.
 */
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random element of an array.
 * @param {any[]} array The array.
 * @returns The element.
 */
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a boolean.
 * @param {number} chance The chance for `true`. (0-1)
 * @returns The boolean.
 */
function randomBoolean(chance = 0.5) {
    return Math.random() < chance;
}

/**
 * Returns a random color.
 * @param {string[]=} colors The colors.
 * @returns The color.
 */
function randomColor(colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]) {
    return "#" + Math.floor(randomInRange(0x000000, 0xFFFFFF)).toString(16);
}
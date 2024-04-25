/**
 * Returns a random number between a minimum and a maximum.
 * @param min The minimum.
 * @param max The maximum.
 * @returns The number.
 */
function randomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

/**
 * Returns a random whole number between a minimum and a maximum.
 * @param min The minimum. (inclusive)
 * @param max The maximum. (inclusive)
 * @returns The number.
 */
function randomIntInRange(min: number, max: number): number {
    return Math.floor(randomInRange(min, max+1));
}

/**
 * Returns a random boolean.
 * @param chance The chance for `true`.
 * @returns The boolean.
 */
function randomBoolean(chance: number = 0.5): boolean {
    return Math.random() < chance;
}

/**
 * Returns a random (hex) color.
 * @returns The color.
 */
function randomColor(): RGBAColor {
    return {
        r: randomIntInRange(0, 255),
        g: randomIntInRange(0, 255),
        b: randomIntInRange(0, 255),
    }
}

function colorToString(color: RGBAColor): string {
    return `rgb(${color.r},${color.g}, ${color.b})`;
}
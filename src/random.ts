/**
 * Generates a integer between a minimum and a maximum.
 * @param min The minimum. (inclusive)
 * @param max The maximum. (inclusive)
 * @returns The random number.
 */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generates a float between a minimum and a maximum.
 * @param min The minimum.
 * @param max The maximum.
 * @returns The random number.
 */
function randomFloat(min: number, max:number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Generates a random color.
 * @returns The random color.
 */
function randomColor(): Color {
    return [Math.random(), Math.random(), Math.random(),1];
}

/**
 * Generates a random boolean.
 * @param a The chance for `true`.
 * @returns The random boolean.
 */
function randomBool(a: number = 0.5): boolean {
    return Math.random() <= a;
}
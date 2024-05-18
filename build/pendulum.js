"use strict";
console.log("pendulum.ts loaded");
class Pendulum {
    /**
     * Whether this is just a dummy. (invisible container for children)
     */
    isDummy;
    /**
     * The length.
     */
    length;
    /**
     * The width.
     */
    width;
    /**
     * The rotation speed.
     */
    rotationSpeed;
    /**
     * The initial angle. (degrees)
     */
    initialAngle;
    /**
     * The color.
     */
    color;
    /**
     * Whether to pass the rotation to child pendulums..
     */
    nestedRotation;
    /**
     * Whether to rotate clockwise or anti-clockwise.
     */
    clockwiseRotation;
    /**
     * The child pendulums.
     */
    children;
    /**
     * The last position.
     */
    lastPosition;
    /**
     * The constructor.
     * @param children The child pendulums.
     */
    constructor(isDummy = false, ...children) {
        // TODO: Make values dependent on screen size
        /*
        TODO: Improve "randomness"
        * randomize category instead of randomizing each value individually
            * Snake - Width varies greatly
            * Wiggler - Length varies greatly
            * Spinner - Fast rotation speed
            * Cleaner - Same color as background
        */
        this.isDummy = isDummy;
        this.length = {
            base: randomIntInRange(100, 250),
            amplitude: randomInRange(10, 25),
            frequency: randomInRange(0.25, 10)
        };
        this.width = {
            base: randomIntInRange(5, 25),
            amplitude: randomInRange(1, 10),
            frequency: randomInRange(0.1, 10)
        };
        this.rotationSpeed = randomIntInRange(5, 25);
        this.initialAngle = randomInRange(0, 360);
        this.color = {
            previous: randomColor(),
            next: randomColor(),
            frequency: randomInRange(4, 7),
            timer: 0
        };
        this.nestedRotation = randomBoolean(0.75);
        this.clockwiseRotation = randomBoolean();
        this.children = children;
    }
    /**
     * Draws the pendulum.
     * @param parentX The parent x position.
     * @param parentY The parent y position.
     * @param parentAngle The parent angle. (degrees)
     */
    draw(parentX, parentY, parentAngle, deltaTime) {
        const angle = parentAngle + this.initialAngle + (this.clockwiseRotation ? -1 : 1) * this.rotationSpeed * time;
        const x = parentX + this.getCurrentValue(this.length) * Math.cos(angle * Math.PI / 180);
        const y = parentY + this.getCurrentValue(this.length) * Math.sin(angle * Math.PI / 180);
        const currentColor = this.updateColor(deltaTime);
        if (!this.isDummy && this.lastPosition) {
            context.beginPath();
            context.strokeStyle = currentColor;
            context.lineWidth = Math.max(this.getCurrentValue(this.width), 1);
            context.moveTo(this.lastPosition[0], this.lastPosition[1]);
            context.lineTo(x, y);
            context.stroke();
            context.closePath();
        }
        this.lastPosition = [x, y];
        const childAngle = this.nestedRotation ? angle : parentAngle;
        this.children.forEach(child => child.draw(x, y, childAngle, deltaTime));
    }
    updateColor(deltaTime) {
        if (this.color.frequency == 0) {
            return colorToString(this.color.previous);
        }
        this.color.timer += deltaTime;
        if (this.color.timer > this.color.frequency) {
            this.color.timer = 0;
            this.color.previous = this.color.next;
            this.color.next = randomColor();
            this.color.frequency = randomInRange(4, 7);
        }
        const blendPercentage = this.color.timer / this.color.frequency;
        const [previousA, nextA] = [1 - blendPercentage, blendPercentage];
        return colorToString({
            r: Math.floor(previousA * this.color.previous.r + nextA * this.color.next.r),
            g: Math.floor(previousA * this.color.previous.g + nextA * this.color.next.g),
            b: Math.floor(previousA * this.color.previous.b + nextA * this.color.next.b),
        });
    }
    /**
     * Returns the current value for a oscillating property.
     * @param property The oscillating property.
     * @returns The current value.
     */
    getCurrentValue(property) {
        if (property.frequency == 0)
            return property.base;
        return property.base + property.amplitude * Math.sin(2 * Math.PI * (time % property.frequency) / property.frequency);
    }
}

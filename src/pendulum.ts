console.log("pendulum.ts loaded");

class Pendulum {
    /**
     * The length.
     */
    public length: OscillatingProperty;

    /**
     * The width.
     */
    public width: OscillatingProperty;

    /**
     * The rotation speed.
     */
    public rotationSpeed: number;

    /**
     * The initial angle. (degrees)
     */
    public initialAngle: number;

    /**
     * The color.
     */
    public color: {
        previous: RGBAColor,
        next: RGBAColor,
        frequency: number,
        lastBlendPercentage: number
    };

    /**
     * Whether to pass the rotation to child pendulums..
     */
    private nestedRotation: boolean;

    /**
     * Whether to rotate clockwise or anti-clockwise.
     */
    private clockwiseRotation: boolean;

    /**
     * The child pendulums.
     */
    public readonly children: Pendulum[];

    /**
     * The last position.
     */
    private lastPosition?: [x: number, y: number];

    /**
     * The constructor.
     * @param children The child pendulums.
     */
    constructor(isDummy: boolean = false, ...children: Pendulum[]) {
        // TODO: Make values dependent on screen size
        /* 
        TODO: Improve "randomness"
        * randomize category instead of randomizing each value individually
            * Snake - Width varies greatly
            * Wiggler - Length varies greatly
            * Spinner - Fast rotation speed
            * Cleaner - Same color as background
        */
        this.length = {
            base: randomIntInRange(100, 250),
            amplitude: randomInRange(10, 25),
            frequency: randomInRange(1, 10)
        };
        this.width = {
            base: randomIntInRange(5, 25),
            amplitude: randomInRange(1,10),
            frequency: randomInRange(0.01, 10)
        };
        this.rotationSpeed = randomIntInRange(5, 25);
        this.initialAngle = randomInRange(0, 360);
        this.color = {
            previous: randomColor(),
            next: randomColor(),
            frequency: randomInRange(3, 10),
            lastBlendPercentage: 0
        }
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
    public draw(parentX: number, parentY: number, parentAngle: number): void {
        const angle = parentAngle + this.initialAngle + (this.clockwiseRotation ? -1 : 1) * this.rotationSpeed * time;

        const x = parentX + this.getCurrentValue(this.length) * Math.cos(angle * Math.PI / 180);
        const y = parentY + this.getCurrentValue(this.length) * Math.sin(angle * Math.PI / 180);
        const currentColor = this.updateColor();
        if (this.lastPosition) {
            context.beginPath();
            context.strokeStyle = currentColor;
            context.lineWidth = Math.max(this.getCurrentValue(this.width), 1);
            context.moveTo(this.lastPosition[0], this.lastPosition[1]);
            context.lineTo(x, y);
            context.stroke();
        }
        this.lastPosition = [x, y];

        const childAngle = this.nestedRotation ? angle : parentAngle;
        this.children.forEach(child => child.draw(x, y, childAngle));
    }

    private updateColor(): string {
        if (this.color.frequency == 0) { return colorToString(this.color.previous);}
        const blendPercentage = (Math.cos(2 * Math.PI * (time % this.color.frequency) / this.color.frequency) + 1) / 2;
        if (blendPercentage < this.color.lastBlendPercentage) {
            this.color.previous = this.color.next;
            this.color.next = randomColor();
            this.color.frequency = randomInRange(3,10)
        }

        const [previousA, nextA] = [1-blendPercentage, blendPercentage];
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
    private getCurrentValue(property: OscillatingProperty): number {
        if (property.frequency == 0) return property.base; 
        return property.base + property.amplitude * Math.sin(2 * Math.PI * (time % property.frequency) / property.frequency);
    }
}



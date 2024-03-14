console.log("pendulum.ts loaded");

/**
 * The pendulum.
 */
class Pendulum {
    /**
     * The child pendulums.
     */
    public readonly children: Pendulum[] = [];

    /**
     * Whether this pendulum is visible.
     */
    public visible: boolean = true;

    /**
     * The length.
     */
    public length: number;

    /**
     * The size.
     */
    public size: number;

    /**
     * The rotation speed.
     */
    public rotationSpeed: number;

    /**
     * The angle.
     */
    public angle: number;

    /**
     * The color.
     */
    public color: Color;

    /**
     * The length amplitude.
     */
    public lengthAmplitude: number;

    /**
     * The length frequency.
     */
    public lengthFrequency: number;

    /**
     * The length amplitude.
     */
    public sizeAmplitude: number;

    /**
     * The length frequency.
     */
    public sizeFrequency: number;

    /**
     * The rotation direction.
     */
    public rotationDirection: RotationDirection;

    /**
     * Whether the rotation is passed down to the children.
     */
    public rotationPassedToChildren: boolean;

    /**
     * The constructor.
     */
    public constructor() {
        this.length = randomInt(...settingRanges.length);
        this.size = randomFloat(...settingRanges.size);
        this.rotationSpeed = randomFloat(...settingRanges.rotationSpeed);
        this.angle = randomFloat(...settingRanges.angle);
        this.color = randomColor();
        this.lengthAmplitude = randomFloat(...settingRanges.lengthAmplitude);
        this.lengthFrequency = randomFloat(...settingRanges.lengthFrequency);
        this.sizeAmplitude = randomFloat(...settingRanges.sizeAmplitude);
        this.sizeFrequency = randomFloat(...settingRanges.sizeFrequency);
        this.rotationDirection = randomBool() ? "clockwise" : "anti-clockwise";
        this.rotationPassedToChildren = randomBool();
    }

    /**
     * Draws the animation.
     * @param matrix The transformation Matrix.
     */
    public draw(matrix: TransformationMatrix): void {
        if (this.visible) {
        }
        this.children.forEach(child => child.draw(matrix));
    }
}


Pendulum.prototype.toString = () => "asdf";
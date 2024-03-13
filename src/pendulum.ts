console.log("pendulum.ts loaded");

/**
 * The pendulum.
 */
class Pendulum {
    /**
     * The child pendulums.
     */
    public readonly children: Set<Pendulum> = new Set<Pendulum>();
    
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
     * The canvas element.
     */
    private readonly canvas: HTMLCanvasElement;

    /**
     * The constructor.
     */
    public constructor() {
        this.canvas = document.createElement("canvas");
        document.body.insertBefore(this.canvas, null);
        this.resize();

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
    }

    /**
     * Updates the canvas size.
     */
    public resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.children.forEach(child => child.resize());
    }

    /**
     * Destroys the canvas.
     */
    public destroy() {
        this.canvas.remove();
        this.children.forEach(child => child.destroy());
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
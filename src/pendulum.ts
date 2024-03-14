console.log("pendulum.ts loaded");

/**
 * The pendulum.
 */
class Pendulum {
    private static count: number = 0;

    /**
     * The id.
     */
    public readonly id: number;

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
     * The canvas element.
     */
    private readonly canvas: HTMLCanvasElement;

    /**
     * The constructor.
     */
    public constructor() {
        this.id = Pendulum.count++;

        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute('pendulum', this.id.toFixed());
        document.body.insertBefore(this.canvas, null);

        this.updateSize();

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
     * Updates the canvas size.
     */
    public updateSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.children.forEach(child => child.updateSize());
    }

    /**
     * Destroys the canvas.
     */
    public destroy() {
        this.canvas.remove();
        this.children.forEach(child => child.destroy());
    }

    /**
     * Updates the hierarchy.
     */
    public updateHierarchie() {
        // children are sorted ascending by their id
        this.children.sort((a,b) => b.id-a.id);
        // update canvas hierarchie
        this.children.reverse().forEach(child => this.canvas.insertBefore(child.canvas, null));
        // update hierarchie of children
        this.children.forEach(child => child.updateHierarchie());
    }

    /**
     * Draws the animation.
     * @param matrix The transformation Matrix.
     */
    public draw(matrix: TransformationMatrix): void {
        if (this.visible) {
            const context = this.canvas.getContext("2d");
        }
        this.children.forEach(child => child.draw(matrix));
    }
}


Pendulum.prototype.toString = () => "asdf";
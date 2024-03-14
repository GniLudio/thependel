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
    public visible: boolean;

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
     * The timer. (in seconds)
     * @see {@link calculateLengthOffset} and {@link calculateSizeOffset}
     */
    private timer: number;

    /**
     * The last point.
     */
    private lastPoint: Point;

    /**
     * The constructor.
     */
    public constructor(dummy: boolean = false) {
        this.length = dummy ? 0 : randomInt(...settingRanges.length);
        this.size = dummy ? 0 : randomFloat(...settingRanges.size);
        this.rotationSpeed = dummy ? 0 : randomFloat(...settingRanges.rotationSpeed);
        this.angle = dummy ? 0 : randomFloat(...settingRanges.angle);
        this.color = dummy ? [0,0,0,1] : randomColor();
        this.lengthAmplitude = dummy ? 0 : randomFloat(...settingRanges.lengthAmplitude);
        this.lengthFrequency = dummy ? 0 : randomFloat(...settingRanges.lengthFrequency);
        this.sizeAmplitude = dummy ? 0 : randomFloat(...settingRanges.sizeAmplitude);
        this.sizeFrequency = dummy ? 0 : randomFloat(...settingRanges.sizeFrequency);
        this.rotationDirection = dummy ? "clockwise" : (randomBool() ? "clockwise" : "anti-clockwise");
        this.rotationPassedToChildren = dummy ? false : randomBool();
        this.timer = dummy ? 0 : randomFloat(0, Math.max(this.lengthFrequency, this.sizeFrequency));
        this.visible = dummy ? false : true;
        this.lastPoint = undefined!;
    }

    /**
     * Draws the animation.
     * @param matrix The transformation Matrix.
     * @param deltaTime The delta time. (in seconds)
     */
    public draw(matrix: TransformationMatrix, deltaTime: number): void {
        this.timer += deltaTime;
        this.angle += (this.rotationDirection == "clockwise" ? 1 : -1) * deltaTime * this.rotationSpeed;
        const rotationMatrix = TransformationMatrix.rotation(undefined, undefined, this.angle * Math.PI / 180);
        const translationMatrix = TransformationMatrix.translation(this.length);
        const newMatrix = translationMatrix.concatenate(rotationMatrix).concatenate(matrix);
        const newPoint = newMatrix.apply([this.calculateLengthOffset(), 0, 0, 1]);
        if (this.visible && this.lastPoint) {
            const context = canvas.getContext("2d")!;

            context.beginPath();
            context.moveTo(this.lastPoint[0], this.lastPoint[1]);
            context.lineTo(newPoint[0], newPoint[1]);
            context.lineCap = "round";
            context.lineWidth = this.size + this.calculateSizeOffset();
            context.strokeStyle = convertColorToStr(this.color);
            context.stroke();
        }
        this.lastPoint = newPoint;
        
        let nestedMatrix = newMatrix;
        if (!this.rotationPassedToChildren) {
            const inverseRotationMatrix = TransformationMatrix.rotation(undefined, undefined, -this.angle * Math.PI / 180);
            nestedMatrix = inverseRotationMatrix.concatenate(nestedMatrix);
        }
        this.children.forEach(child => child.draw(nestedMatrix, deltaTime));
    }
    /**
     * Calcaulates the length offset depending on the {@link lengthAmplitude}, the {@link lengthFrequency} and the {@link timer}.
     * @returns The length offset.
     */
    private calculateLengthOffset(): number {
        if (this.lengthFrequency <= 0) return 0;
        const a = Math.cos(2 * Math.PI * (this.timer % this.lengthFrequency) / this.lengthFrequency);
        return a * this.lengthAmplitude;
    }

    /**
     * Calcaulates the size offset depending on the {@link sizeAmplitude}, the {@link sizeFrequency} and the {@link timer}.
     * @returns The size offset.
     */
    private calculateSizeOffset(): number {
        if (this.sizeFrequency <= 0) return 0;
        const a = Math.cos(2 * Math.PI * (this.timer % this.sizeFrequency) / this.sizeFrequency);
        const limitOffset = Math.min(this.size + 1, this.sizeAmplitude);
        return a * limitOffset;
    }
}
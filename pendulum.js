console.log("pendulum.js loaded");

class Pendulum {
    /**
     * The constructor. (all parameters are optional)
     */
    constructor() {
        /**
         * The nested pendulum.
         * @type {Pendulum}
         */
        this.nestedPendulum = undefined;
        /**
         * The last point.
         * @type {[x: number, y: number, z: number, 1]}
         */
        this.lastPoint = [undefined, undefined, undefined, undefined];
        /**
         * The timer. (seconds)
         * * used by {@link calculateLengthOffset} and {@link calculateSizeOffset}
         */
        this.timer = 0;

        this.refresh();
    }

    /**
     * Randomizes all properties.
     */
    refresh() {
        /**
         * The length.
         * @type {number}
         */
        this.length = roundToDecimal(randomInRange(50, 250), 0);
        /**
         * The size.
         * @type {number}.
         */
        this.size = roundToDecimal(randomInRange(1, 25), 0);
        /**
         * The rotation speed.
         * @type {number}
         */
        this.rotationSpeed = roundToDecimal(randomInRange(5, 25), 1);
        /**
         * The angle.
         * @type {number} 
         */
        this.angle = roundToDecimal(randomInRange(0, 360), 2);
        /**
         * The color.
         * @type {string}
         */
        this.color = randomColor();
        /**
         * The length amplitude.
         * @type {number}
         */
        this.lengthAmplitude = roundToDecimal(randomInRange(0, 25), 0);
        /**
         * The length frequency.
         * @type {number}
         */
        this.lengthFrequency = roundToDecimal(randomInRange(1, 10), 2);
        /**
         * The size amplitude.
         * @type {number}
         */
        this.sizeAmplitude = roundToDecimal(randomInRange(1, 10), 0);
        /**
         * The size frequency.
         * @type {number}
         */
        this.sizeFrequency = roundToDecimal(randomInRange(0, 10), 2);
        /**
         * Whether the rotation is passed down to nested pendulums.
         * @type {boolean}
         */
        this.nestedRotation = true;
        /**
         * Whether to rotate clockwise or anti-clockwise.
         * @type {boolean}
         */
        this.clockwise = randomBoolean();
        /**
         * Whether the pendulum is visible.
         * @type {boolean}
         */
        this.visible = true;
    }

    /**
     * Draws the pendulum.
     * @param {CanvasRenderingContext2D} context The 2d context.
     * @param {TransformationMatrix} matrix The parent transformation matrix.
     * @param {number} deltaTime The delta time. (seconds)
     */
    draw(context, matrix, deltaTime) {
        this.timer += deltaTime;
        this.angle = (this.angle + (this.clockwise ? -1 : 1) * deltaTime * this.rotationSpeed) % 360;
        const rotationMatrix = TransformationMatrix.rotateZ(this.angle * Math.PI / 180);
        const translationMatrix = TransformationMatrix.translate(this.length);
        const newMatrix = translationMatrix.concatenate(rotationMatrix).concatenate(matrix);
        const newPoint = newMatrix.apply([this.calculateLengthOffset(),0,0,1]);

        if (this.visible) {
            context.beginPath();
            context.moveTo(this.lastPoint[0], this.lastPoint[1]);
            context.lineTo(newPoint[0], newPoint[1]);
            context.lineWidth = this.size + this.calculateSizeOffset();
            context.strokeStyle = this.color;
            context.stroke();
        }

        if (this.nestedPendulum) {
            let nestedMatrix = newMatrix;
            if (!this.nestedRotation) {
                const inverseRotationMatrix = TransformationMatrix.rotateZ(-this.angle * Math.PI / 180);
                nestedMatrix = inverseRotationMatrix.concatenate(nestedMatrix);
            }
            this.nestedPendulum.draw(context, nestedMatrix, deltaTime);
        }

        this.lastPoint = newPoint;
    }

    /**
     * Calculates the length offset depending on the {@link lengthAmplitude}, the {@link lengthFrequency} and the {@link timer}.
     * @returns The length offset.
     */
    calculateLengthOffset() {
        if (this.lengthFrequency <= 0) return 0;
        const a = Math.cos(2 * Math.PI * (this.timer % this.lengthFrequency) / this.lengthFrequency);
        return a * this.lengthAmplitude;
    }

    /**
     * Calculates the size offset depending on the {@link sizeAmplitude}, the {@link sizeFrequency} and the {@link timer}.
     * @returns The size offset.
     */
    calculateSizeOffset() {
        if (this.sizeFrequency <= 0) return 0;
        const a = Math.cos(2 * Math.PI * (this.timer % this.sizeFrequency) / this.sizeFrequency);
        const limitOffset = Math.min(this.size, this.sizeAmplitude);
        return a * limitOffset;
    }
}


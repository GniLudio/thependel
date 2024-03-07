console.log("pendulum.js loaded");

class Pendulum {
    /**
     * The constructor. (all parameters are optional)
     * @param {number=} length The length.
     * @param {number=} size The size.
     * @param {number=} rotationSpeed The rotation speed.
     * @param {number=} angle The starting angle.
     * @param {number=} lengthAmplitude The length amplitude.
     * @param {number=} lengthFrequency The length frequency.
     * @param {number=} sizeAmplitude The size amplitude.
     * @param {number=} sizeFrequency The size frequency.
     * @param {boolean=} clockwise Whether to rotate clockwise or anti-clockwise.
     * @param {boolean=} nestedRotation Whether to pass the rotation to nested pendulums.
     * @param {string=} color 
     * @param {boolean=} visible
     * @param {Pendulum=} nestedPendulum
     */
    constructor(length, size, rotationSpeed, angle, lengthAmplitude, lengthFrequency, sizeAmplitude, sizeFrequency, clockwise, nestedRotation, color, visible, nestedPendulum) {
        /**
         * The length.
         * @type {number}
         */
        this.length = length ?? randomInRange(50, 250);
        /**
         * The size.
         * @type {number}.
         */
        this.size = size ?? randomInRange(1, 25);
        /**
         * The angle.
         * @type {number} 
         */
        this.angle = angle ?? randomInRange(0, 360);
        /**
         * The rotation speed.
         * @type {number}
         */
        this.rotationSpeed = rotationSpeed ?? randomInRange(5, 25);
        /**
         * The color.
         * @type {string}
         */
        this.color = color ?? randomColor();
        /**
         * The length amplitude.
         * @type {number}
         */
        this.lengthAmplitude = lengthAmplitude ?? randomInRange(0, 100);
        /**
         * The length frequency.
         * @type {number}
         */
        this.lengthFrequency = lengthFrequency ?? randomInRange(0, 10);
        /**
         * The size amplitude.
         * @type {number}
         */
        this.sizeAmplitude = sizeAmplitude ?? randomInRange(0, 100);
        /**
         * The size frequency.
         * @type {number}
         */
        this.sizeFrequency = sizeFrequency ?? randomInRange(0, 10);
        /**
         * Whether the rotation is passed down to nested pendulums.
         * @type {boolean}
         */
        this.nestedRotation = nestedRotation!=undefined ? nestedRotation : randomBoolean(0.75);
        /**
         * Whether to rotate clockwise or anti-clockwise.
         * @type {boolean}
         */
        this.clockwise = clockwise!=undefined ? clockwise : randomBoolean();
        /**
         * Whether the pendulum is visible.
         * @type {boolean}
         */
        this.visible = visible!=undefined ? visible : true;
        /**
         * The nested pendulum.
         * @type {Pendulum}
         */
        this.nestedPendulum = nestedPendulum;
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
        const translationMatrix = TransformationMatrix.translate(this.length + this.calculateLengthOffset());
        const newMatrix = translationMatrix.concatenate(rotationMatrix).concatenate(matrix);
        const newPoint = newMatrix.apply([0,0,0,1]);

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
        return 0;
    }

    /**
     * Calculates the length offset depending on the {@link sizeAmplitude}, the {@link sizeFrequency} and the {@link timer}.
     * @returns The length offset.
     */
    calculateSizeOffset() {
        return 0;
    }
}


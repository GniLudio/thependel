console.log("pendulum.js loaded");

/**
 * The pendulum.
 */
class Pendulum {
    const 
    /**
     * The constructor. (all parameters are optional)
     * @param {number} length 
     * @param {number} size 
     * @param {number} rotationSpeed 
     * @param {number} degrees 
     * @param {number} lengthAmplitude 
     * @param {number} lengthFrequency 
     * @param {number} sizeAmplitude 
     * @param {number} sizeFrequency 
     * @param {boolean} clockwise 
     * @param {boolean} nestedRotation 
     * @param {string} color 
     * @param {boolean} visible 
     */
    constructor(length, size, rotationSpeed, degrees, lengthAmplitude, lengthFrequency, sizeAmplitude, sizeFrequency, clockwise, nestedRotation, color, visible, nestedPendulum) {
        this.length = length ?? randomInRange(25, 250);
        this.size = size ?? randomInRange(1, 10);
        this.degrees = degrees ?? randomInRange(0, 360);
        this.rotationSpeed = rotationSpeed ?? randomInRange(10, 50);
        this.color = color ?? randomColor();
        this.lengthAmplitude = lengthAmplitude ?? randomInRange(0, 100);
        this.lengthFrequency = lengthFrequency ?? randomInRange(0.1, 10);
        this.nestedRotation = nestedRotation!=undefined ? nestedRotation : randomBoolean();
        this.clockwise = clockwise!=undefined ? clockwise : randomBoolean(0.75);
        this.visible = visible!=undefined ? visible : true;
        this.nestedPendulum = nestedPendulum;

        this.lastPoint = [undefined, undefined];
    }

    /**
     * Draws the pendulum.
     * @param {CanvasRenderingContext2D} context 
     * @param {TransformationMatrix} matrix The transformation matrix.
     * @param {number} deltaTime The delta time. (seconds)
     */
    draw(context, matrix, deltaTime) {
        this.degrees = (this.degrees + (this.clockwise ? -1 : 1) * deltaTime * this.rotationSpeed) % 360;
        const rotationMatrix = TransformationMatrix.rotateZ(this.degrees * Math.PI / 180);
        const translationMatrix = TransformationMatrix.translate(this.length);
        const newMatrix = translationMatrix.concatenate(rotationMatrix).concatenate(matrix);
        const newPoint = newMatrix.apply([0,0,0,1]);

        if (this.visible) {
            context.beginPath();
            context.moveTo(this.lastPoint[0], this.lastPoint[1]);
            context.lineTo(newPoint[0], newPoint[1]);
            context.lineWidth = this.size;
            context.strokeStyle = this.color;
            context.stroke();
        }

        if (this.nestedPendulum) {
            let nestedMatrix = newMatrix;
            if (!this.nestedRotation) {
                const inverseRotationMatrix = TransformationMatrix.rotateZ(-this.degrees * Math.PI / 180);
                nestedMatrix = inverseRotationMatrix.concatenate(nestedMatrix);
            }
            this.nestedPendulum.draw(context, nestedMatrix, deltaTime);
        }

        this.lastPoint = newPoint;
    }
}


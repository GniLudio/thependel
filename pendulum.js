console.log("pendulum.js loaded");

// FIXME: Modifying the degrees leads to weird jumps.

/**
 * The center of the screen.
 */
const origin = [0,0,0,1];

/**
 * The pendulum.
 */
class Pendulum {
    /**
     * The constructor.
     * @param {number} length The length. 
     * @param {number} startAngle The angle. 
     * @param {number} rotationSpeed The rotation speed.
     * @param {number} size The size.
     * @param {number} color The color.
     * @param {boolean} clockwise Whether to rotate clockwise.
     * @param {boolean} passRotation Whether to pass the rotation to the nested pendulum. 
     * @param {Pendulum | undefined} nestedPendulum The nested pendulum. 
     */
    constructor(length, startAngle, rotationSpeed, size, color, clockwise = false, passRotation = false, nestedPendulum = null, visible=true) {
        this.length = length;
        this.degrees = startAngle;
        this.rotationSpeed = rotationSpeed;
        this.size = size;
        this.color = color;
        this.passRotation = passRotation;
        this.clockwise = clockwise;
        this.nestedPendulum = nestedPendulum;
        this.visible = visible;
        this.lastPoint = [undefined, undefined];
        this.lastDegrees = undefined;
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
        const newPoint = newMatrix.apply(origin);

        // TODO: calculate control point required for a perfect circle
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
            if (!this.passRotation) {
                const inverseRotationMatrix = TransformationMatrix.rotateZ(-this.degrees * Math.PI / 180);
                nestedMatrix = inverseRotationMatrix.concatenate(nestedMatrix);
            }
            this.nestedPendulum.draw(context, nestedMatrix, deltaTime);
        }

        this.lastPoint = newPoint;
    }
}
console.log("transformations.js loaded")

/**
 * A 4x4 transformation matrix which can be used to represent/combine all transformations of a 3D/2D space:
 * * Translation, Rotation, Scaling, Shearing, Mirroring.
 */
class TransformationMatrix {
    /**
     * The contructor.
     * @param {number[][]} matrix The initial 4x4 matrix.
     */
    constructor(matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]) {
        this.matrix = matrix;
    }

    /**
     * Applies this matrix onto the Vec4.
     * @param {number[]} point
     * @returns The transformed vector. 
     */
    apply(point) {
        const result = [undefined,undefined,undefined,undefined];
        for (let i = 0; i < 4; i++)
        {
            result[i] = 0
                + this.matrix[i][0] * point[0]
                + this.matrix[i][1] * point[1]
                + this.matrix[i][2] * point[2]
                + this.matrix[i][3] * point[3];
        }
        return result;
    }

    /**
     * Concatenate transformation matrices.
     * @param {TransformationMatrix} other 
     * @returns The combined matrix.
     */
    concatenate(other) {
        const result = new TransformationMatrix();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result.matrix[i][j] = 0
				+ other.matrix[i][0] * this.matrix[0][j]
				+ other.matrix[i][1] * this.matrix[1][j]
				+ other.matrix[i][2] * this.matrix[2][j]
				+ other.matrix[i][3] * this.matrix[3][j];
            }
        }
        return result;
    }

    /**
     * Creates a copy of this matrix.
     * @returns The copy.
     */
    copy() {
        return new TransformationMatrix([
            [this.matrix[0][0], this.matrix[0][1], this.matrix[0][2], this.matrix[0][3]],
            [this.matrix[1][0], this.matrix[1][1], this.matrix[1][2], this.matrix[1][3]],
            [this.matrix[2][0], this.matrix[2][1], this.matrix[2][2], this.matrix[2][3]],
            [this.matrix[3][0], this.matrix[3][1], this.matrix[3][2], this.matrix[3][3]],
        ])
    }

    /**
     * Returns a string representation.
     * @param {number} digits The number of decimals. 
     * @returns 
     */
    toString(digits = undefined) {
        return "[\n\t" + this.matrix.map(row => row.map((v) => v.toFixed(digits)).join(", ")).join("\n\t") + "\n]";
    }


    /**
     * Returns a matrix which performs a translation.
     * @param {number} x The translation on the x-axis.
     * @param {number} y The translation on the y-axis.
     * @param {number} z The translation on the z-axis.
     * @returns The translation matrix.
     */
    static translate(x = 0, y = 0, z = 0) {
        const result = new TransformationMatrix();
        result.matrix[0][3] = x;
        result.matrix[1][3] = y;
        result.matrix[2][3] = z;
        return result;
    }

    /**
     * Returns a matrix which performs scaling.
     * @param {number} x The scale of the x-axis;
     * @param {number} y The scale of the y-axis;
     * @param {number} z The scale of the z-axis;
     */
    static scale(x = 1, y = 1, z = 1) {
        const result = new TransformationMatrix();
        result[0][0] = x;
        result[1][1] = y;
        result[2][2] = z;
        return result;
    }

    /**
     * Returns a matrix which performs a rotation.
     * @param {number} x The rotation around the x-axis.
     * @param {number} y The rotation around the y-axis.
     * @param {number} z The rotation around the z-axis.
     * @returns The rotation matrix.
     */
    static rotate(x = undefined, y = undefined, z = undefined) {
        let result = new TransformationMatrix();
        if (x) result = result.concatenate(TransformationMatrix.rotateX(x));
        if (y) result = result.concatenate(TransformationMatrix.rotateX(y));
        if (z) result = result.concatenate(TransformationMatrix.rotateX(z));
        return result;
    }

    /**
     * Returns a matrix which rotates around the x axis.
     * @param {number} angle The rotation angle. 
     * @returns The rotation matrix.
     */
    static rotateX(angle) {
        const result = new TransformationMatrix();
        result.matrix[1][1] = Math.cos(angle);
        result.matrix[1][2] = -Math.sin(angle);
        result.matrix[2][1] = Math.sin(angle);
        result.matrix[2][2] = Math.cos(angle);
        return result;
    }

    /**
     * Returns a matrix which rotates around the y axis.
     * @param {number} angle The rotation angle. 
     * @returns The rotation matrix.
     */
    static rotateY(angle) {
        const result = new TransformationMatrix();
        result.matrix[0][0] = Math.cos(angle);
        result.matrix[0][2] = Math.sin(angle);
        result.matrix[2][0] = -Math.sin(angle);
        result.matrix[2][2] = Math.cos(angle);
        return result;
    }

    /**
    * Returns a matrix which rotates around the z axis.
    * @param {number} angle The rotation angle. 
    * @returns The rotation matrix.
    */
    static rotateZ(angle) {
        const result = new TransformationMatrix();
        result.matrix[0][0] = Math.cos(angle);
        result.matrix[0][1] = -Math.sin(angle);
        result.matrix[1][0] = Math.sin(angle);
        result.matrix[1][1] = Math.cos(angle);
        return result;
    }
}
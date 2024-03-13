console.log("transformationMatrix.ts loaded");

/**
 * A 4x4 transformation matrix which can be used to represent and combine all transformations of a 3D and 2D space.
 * * Translation, Rotation, Scaling, Shearing, Mirroring.
 */
class TransformationMatrix {
    /**
     * The data.
     */
    private readonly data: Matrix;

    /**
     * The constructor.
     * @param data The initial matrix.
     */
    public constructor(data: Matrix = [[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]]) {
        this.data = data;
    }

    /**
     * Applies the transformation matrix to a point.
     * @param point The point.
     * @returns The tranformed point.
     */
    public apply(point: Point): Point {
        const result: Point = [undefined!, undefined!, undefined!, undefined!];
        for (let i = 0; i < 4; i++)
        {
            result[i] = 0
                + this.data[i][0] * point[0]
                + this.data[i][1] * point[1]
                + this.data[i][2] * point[2]
                + this.data[i][3] * point[3];
        }
        return result;
    }

    /**
     * Concatenates the two transformation matrices.
     * @param other The other matrix.
     * @returns The combined matrix.
     */
    public concatenate(other: TransformationMatrix): TransformationMatrix {
        const result = new TransformationMatrix();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result.data[i][j] = 0
				+ other.data[i][0] * this.data[0][j]
				+ other.data[i][1] * this.data[1][j]
				+ other.data[i][2] * this.data[2][j]
				+ other.data[i][3] * this.data[3][j];
            }
        }
        return result;
    }

    /**
     * Converts the matrix to a string rerpesentation.
     * @returns 
     */
    public toString(): string {
        return "{\n    " + this.data.map(row => row.join(", ")).join("\n    ") + "\n}";
    }

    /**
     * A translation matrix.
     * @param x The x translation.
     * @param y The y translation.
     * @param z The z translation.
     * @returns The translation matrix.
     */
    public static translation(x?: number, y?: number, z?: number): TransformationMatrix {
        const result = new TransformationMatrix();
        if (x) result.data[0][3] = x;
        if (y) result.data[1][3] = y;
        if (z) result.data[2][3] = z;
        return result;
    }

    /**
     * A scaling matrix.
     * @param x The x scaling.
     * @param y The y scaling.
     * @param z The z scaling.
     * @returns The scaling matrix.
     */
    public static scaling(x?: number, y?: number, z?: number): TransformationMatrix {
        const result = new TransformationMatrix();
        if (x) result.data[0][0] = x;
        if (y) result.data[1][1] = y;
        if (z) result.data[2][2] = z;
        return result;
    }

    /**
     * A rotation matrix.
     * @param x The x rotation.
     * @param y The y rotation.
     * @param z The z rotation.
     * @returns The rotation matrix.
     */
    public static rotation(x?: number, y?: number, z?: number): TransformationMatrix {
        let result: TransformationMatrix = new TransformationMatrix();
        if (x) {
            const xRotation = new TransformationMatrix();
            xRotation.data[1][1] = Math.cos(x);
            xRotation.data[1][2] = Math.sin(x);
            xRotation.data[2][1] = -Math.sin(x);
            xRotation.data[2][2] = Math.cos(x);
            result = result.concatenate(xRotation);
        }
        if (y) {
            const yRotation = new TransformationMatrix();
            yRotation.data[0][0] = Math.cos(y);
            yRotation.data[0][2] = -Math.sin(y);
            yRotation.data[2][0] = Math.sin(y);
            yRotation.data[2][2] = Math.cos(y);
            result = result.concatenate(yRotation);
        }
        if (z) {
            const zRotation = new TransformationMatrix();
            zRotation.data[0][0] = Math.cos(z);
            zRotation.data[0][1] = -Math.sin(z);
            zRotation.data[1][0] = Math.sin(z);
            zRotation.data[1][1] = Math.cos(z);
            result = result.concatenate(zRotation);
        }
        return result;
    }
}

type Point = [number, number, number, 1];
type Matrix = [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
]
console.log("settings.ts loaded");

const settings: Settings = {
    fps: 15,
    pendulum_count: 10,
}

const settingRanges: {[setting: string]: [min: number, max: number]} = {
    fps: [1, 240],
    pendulum_count: [3, 100],

    length: [25,250],
    size: [10,100],
    rotationSpeed: [0,100],
    angle: [0,360],
    lengthAmplitude: [10,100],
    lengthFrequency: [0.01,10],
    sizeAmplitude: [5,50],
    sizeFrequency: [0.01,10],
}
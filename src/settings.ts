console.log("settings.ts loaded");

const settings: Settings = {
    fps: 60,
    pendulum_count: 10,
    hideAuthor: false,
    hideRepo: false,
    refreshInterval: 60 + 10,
    initialDuration: 10,
}

const settingRanges: {[setting: string]: [min: number, max: number]} = {
    fps: [1, 240],
    pendulum_count: [3, 100],

    length: [50,500],
    size: [1,25],
    rotationSpeed: [0,100],
    angle: [0,360],
    lengthAmplitude: [25,250],
    lengthFrequency: [0.01,10],
    sizeAmplitude: [1,25],
    sizeFrequency: [0.01,10],
}
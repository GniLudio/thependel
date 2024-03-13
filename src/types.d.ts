type Settings = UserSettings & GeneralSettings;

interface UserSettings {
    pendulum_count: number,
}

interface GeneralSettings {
    fps: number,
}

interface Window {
    wallpaperPropertyListener: WallpaperListener;
}

interface WallpaperListener {
    applyGeneralProperties?(properties: Partial<GeneralSettings>): void;
    applyUserProperty?(properties: Partial<UserSettings>): void;
    setPaused?(isPaused: boolean): void;
    userDirectoryFilesAddedOrChanged?(propertyName: string, changedFiles: string[]): void;
    userDirectoryFilesRemoved?(propertyName: string, removedFiles: string[]): void;
}

type Color = [r: number, g: number, b: number, a: number]

type RotationDirection = "clockwise" | "anti-clockwise";
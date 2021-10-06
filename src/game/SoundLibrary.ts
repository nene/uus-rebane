import pouringBeer from "./sounds/pouring-beer.mp3";
import openingBeer from "./sounds/opening-beer.mp3";
import openingCabinetDoor from "./sounds/opening-cabinet-door.mp3";
import openingFridgeDoor from "./sounds/opening-fridge-door.mp3";
import coins from "./sounds/coins.wav";

const soundFiles = {
  'pouring-beer': pouringBeer,
  'opening-beer': openingBeer,
  'opening-cabinet-door': openingCabinetDoor,
  'opening-fridge-door': openingFridgeDoor,
  'coins': coins,
};

type SoundName = keyof typeof soundFiles;

export class SoundLibrary {
  private static sounds: Record<string, HTMLAudioElement> = {};

  public static async load() {
    for (const [name, fileName] of Object.entries(soundFiles)) {
      this.sounds[name] = await this.loadAudio(fileName);
    }
  }

  private static async loadAudio(src: string): Promise<HTMLAudioElement> {
    return new Promise((resolve) => {
      const audioEl = new Audio(src);
      audioEl.preload = "auto";
      audioEl.addEventListener("canplay", () => resolve(audioEl));
    });
  }

  public static play(soundName: SoundName) {
    const audioEl = this.sounds[soundName];
    audioEl.currentTime = 0;
    audioEl.play();
  }
}

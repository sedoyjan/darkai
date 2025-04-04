import { Audio } from 'expo-av';

class Sounds {
  soundsMap: Record<string, Audio.Sound> = {};

  constructor() {
    this.loadSounds();
  }

  private async loadSounds() {
    const { sound: completeSound } = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../assets/sounds/complete.mp3'),
    );

    this.soundsMap.complete = completeSound;
  }

  async playComplete() {
    const sound = this.soundsMap.complete;
    if (sound) {
      await sound.replayAsync();
    }
  }
}

export const sounds = new Sounds();

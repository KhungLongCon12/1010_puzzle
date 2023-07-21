import {
  _decorator,
  AudioClip,
  AudioSource,
  Component,
  Node,
  randomRangeInt,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("MusicGame")
export class MusicGame extends Component {
  @property({ type: AudioClip })
  private clips: AudioClip[] = [];

  @property({ type: AudioSource })
  private musicBg: AudioSource;

  onAudioQueue(index: number): void {
    let random = randomRangeInt(0, 5);
    if (random % 2 === 0) {
      this.musicBg.clip = this.clips[0];
    } else if (random % 2 === 1) {
      this.musicBg.clip = this.clips[1];
    }

    this.musicBg.play();
  }
}

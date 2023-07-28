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
  @property({ type: AudioSource })
  private musicBg: AudioSource;

  onAudioQueue(): void {
    this.musicBg.play();
  }
}

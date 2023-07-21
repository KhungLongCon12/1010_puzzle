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

  @property(AudioSource)
  private audioSourceMenu: AudioSource;

  private index: number;

  onAudioQueue() {
    this.index = randomRangeInt(0, 1);
    // this.index = 1;
    let clip: AudioClip = this.clips[this.index];
    this.audioSourceMenu.playOneShot(clip);
    this.audioSourceMenu.loop = true;
  }
}

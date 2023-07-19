import {
  _decorator,
  AudioSource,
  Component,
  director,
  Node,
  tween,
  TweenSystem,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {
  @property({ type: Node })
  private buttonPlay: Node | null = null;

  @property({ type: AudioSource })
  private musicBackGround: AudioSource;

  @property({ type: Node })
  private volume: Node | null = null;

  @property({ type: Node })
  private muteVolume: Node | null = null;

  private muted: number = 1;

  protected onLoad(): void {
    this.handlePlayHover();
  }

  protected update(dt: number): void {
    TweenSystem.instance.update(dt);
  }

  private handlePlayHover(): void {
    this.buttonPlay.on(Node.EventType.MOUSE_ENTER, () => {
      const scaleTo: Vec3 = new Vec3(1.1, 1.1, 1);
      const duration = 0.5;

      const twe = tween(this.buttonPlay).to(
        duration,
        { scale: scaleTo },
        { easing: "quadOut" }
      );
      twe.start();
      // this.buttonPlay.setScale(new Vec3(1.1, 1.1, 1));
    });

    this.buttonPlay.on(Node.EventType.MOUSE_LEAVE, () => {
      const scaleTo: Vec3 = new Vec3(1, 1, 1);
      const duration = 0.5;

      const twe = tween(this.buttonPlay).to(
        duration,
        { scale: scaleTo },
        { easing: "quadOut" }
      );

      twe.start();
      // this.buttonPlay.setScale(new Vec3(1, 1, 1));
    });
  }

  private handleBtnPlay(): void {
    director.loadScene("GamePlay");
  }

  private handleHint(): void {
    console.log("hint");
  }

  private handleVolume(): void {
    this.muted = this.musicBackGround.volume === 1 ? 0 : 1;

    if (this.muted === 1) {
      this.volume.active = true;
      this.muteVolume.active = false;
    } else {
      this.volume.active = false;
      this.muteVolume.active = true;
    }

    this.musicBackGround.volume = this.muted;
  }
}

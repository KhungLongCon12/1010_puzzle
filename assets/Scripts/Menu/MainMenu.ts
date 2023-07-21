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
import { ViewMenu } from "./ViewMenu";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {
  @property({ type: ViewMenu })
  private view: ViewMenu;

  @property({ type: AudioSource })
  private musicBackGround: AudioSource;

  @property({ type: Node })
  private buttonPlay: Node | null = null;

  private muted: number = 1;
  private darkModeOn: boolean = true;

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

  private handleDarkMode(): void {
    this.darkModeOn = this.darkModeOn === true ? false : true;
    this.view.lightAndDarkMode(this.darkModeOn);
    this.view.saveStatusMode(this.darkModeOn);
  }

  private handleVolume(): void {
    this.muted = this.musicBackGround.volume === 1 ? 0 : 1;

    this.view.volumeOnOff(this.muted);

    this.musicBackGround.volume = this.muted;

    this.view.saveStatusVol(this.muted);
  }
}

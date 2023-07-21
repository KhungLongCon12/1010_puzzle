import {
  _decorator,
  AudioSource,
  Component,
  director,
  Node,
  sys,
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
  private darkMode: boolean = false; // true: turn on  ----- false: turn off

  protected onLoad(): void {
    this.handlePlayHover();
    sys.localStorage.setItem("statusMode1010", JSON.stringify(this.darkMode));
    sys.localStorage.setItem("statusCheckVol1010", JSON.stringify(this.muted));
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
    this.view.lightAndDarkMode(this.darkMode);
    this.darkMode = this.darkMode ? false : true;
    this.view.saveStatusMode(this.darkMode);
  }

  private handleVolume(): void {
    this.muted = this.musicBackGround.volume === 1 ? 0 : 1;
    this.view.saveStatusVol(this.muted);
    this.view.volumeOnOff(this.muted);

    this.musicBackGround.volume = this.muted;
  }
}

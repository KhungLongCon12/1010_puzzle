import { _decorator, color, Component, Label, Node, Sprite, sys } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ViewMenu")
export class ViewMenu extends Component {
  @property({ type: Sprite })
  private backGround: Sprite | null = null;

  @property({ type: Node })
  private volume: Node | null = null;

  @property({ type: Node })
  private muteVolume: Node | null = null;

  @property({ type: Node })
  private lightMode: Node | null = null;

  @property({ type: Node })
  private darkMode: Node | null = null;

  @property({ type: Label })
  private title: Label | null = null;

  @property({ type: Label })
  private nameGame: Label | null = null;

  public lightAndDarkMode(modeOn: boolean): void {
    if (!modeOn) {
      this.lightMode.active = false;
      this.darkMode.active = true;

      this.backGround.color = color(0, 0, 0, 255);
      this.title.color = color(255, 255, 255, 255);
      this.nameGame.color = color(255, 255, 255, 255);
    } else {
      this.lightMode.active = true;
      this.darkMode.active = false;

      this.backGround.color = color(255, 255, 255, 255);
      this.title.color = color(112, 101, 101, 255);
      this.nameGame.color = color(0, 0, 0, 255);
    }
  }

  public volumeOnOff(checkVol): void {
    if (checkVol === 1) {
      this.volume.active = true;
      this.muteVolume.active = false;
    } else {
      this.volume.active = false;
      this.muteVolume.active = true;
    }
  }

  saveStatusMode(modeOn: boolean) {
    sys.localStorage.setItem("statusMode1010", JSON.stringify(modeOn));
  }

  saveStatusVol(checkVol: number) {
    sys.localStorage.setItem("statusCheckVol1010", JSON.stringify(checkVol));
  }
}

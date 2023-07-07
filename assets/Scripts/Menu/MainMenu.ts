import { _decorator, Component, director, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {
  @property({ type: Node })
  private buttonPlay: Node | null = null;

  protected onLoad(): void {
    this.handlePlayHover();
  }

  handlePlayHover() {
    console.log("hover");

    this.buttonPlay.on(Node.EventType.MOUSE_ENTER, () => {
      this.buttonPlay.setScale(new Vec3(1.1, 1.1, 1));
    });

    this.buttonPlay.on(Node.EventType.MOUSE_LEAVE, () => {
      this.buttonPlay.setScale(new Vec3(1, 1, 1));
    });
  }

  handleBtnPlay() {
    director.loadScene("GamePlay");
  }

  handleHint() {
    console.log("hint");
  }

  handleVolume() {
    console.log("volume");
  }
}

import {
  _decorator,
  AudioSource,
  color,
  Component,
  director,
  instantiate,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  sys,
  Vec3,
} from "cc";
import { MusicGame } from "./MusicGame";
const { ccclass, property } = _decorator;

@ccclass("GameView")
export class GameView extends Component {
  @property({ type: AudioSource })
  private audio: AudioSource;

  @property({ type: Node })
  private gridNode: Node | null = null;

  @property({ type: Sprite })
  private topBackGround: Sprite | null = null;

  @property({ type: Sprite })
  private backGround: Sprite | null = null;

  @property({ type: Node })
  private shapeContainer: Node[] = [];

  @property({ type: SpriteFrame })
  private squareColorFrames: SpriteFrame[] = [];

  @property({ type: Node })
  private currentScore: Node | null = null;

  @property({ type: Node })
  private highScore: Node | null = null;

  @property({ type: Node })
  private lightOn: Node | null = null;

  @property({ type: Node })
  private lightOff: Node | null = null;

  @property({ type: Node })
  private volumeOn: Node | null = null;

  @property({ type: Node })
  private volumeOff: Node | null = null;

  public get ShapeContainer(): Node[] {
    return this.shapeContainer;
  }
  public set ShapeContainer(shapeContainer: Node[]) {
    this.shapeContainer = shapeContainer;
  }

  public get SquareColorFrames(): SpriteFrame[] {
    return this.squareColorFrames;
  }
  public set SquareColorFrames(squareColorFrames: SpriteFrame[]) {
    this.squareColorFrames = squareColorFrames;
  }

  private gridBackground: Node[][] = [];

  private squaresGap: number = -0.5;
  private gridSize: number = 50;
  private darkMode: boolean;
  private checkVolume: number;

  protected start(): void {
    this.readLocalStorage();
  }

  private readLocalStorage(): void {
    console.log("read");
    this.darkMode = JSON.parse(sys.localStorage.getItem("statusMode1010"));

    this.checkVolume = JSON.parse(
      sys.localStorage.getItem("statusCheckVol1010")
    );

    if (this.darkMode) {
      this.lightOn.active = false;
      this.lightOff.active = true;

      this.topBackGround.color = color(0, 0, 0, 255);
      this.backGround.color = color(0, 0, 0, 255);
    } else {
      this.lightOn.active = true;
      this.lightOff.active = false;

      this.topBackGround.color = color(255, 255, 255, 255);
      this.backGround.color = color(255, 255, 255, 255);
    }

    if (this.checkVolume === 1) {
      this.volumeOn.active = true;
      this.volumeOff.active = false;
      this.audio.volume = this.checkVolume;
    } else {
      this.volumeOn.active = false;
      this.volumeOff.active = true;
      this.audio.volume = this.checkVolume;
    }
  }

  // create BackGround
  spawnGridSquares(GridSquare: Prefab, Rows: number, Columns: number) {
    for (let row = 0; row < Rows; ++row) {
      this.gridBackground.push([]);

      for (let column = 0; column < Columns; ++column) {
        const newGridSquare = instantiate(GridSquare);

        this.gridNode.addChild(newGridSquare);
        this.gridBackground[row].push(newGridSquare);

        newGridSquare.position = new Vec3(
          (-Columns / 2 + column - this.squaresGap) * this.gridSize,
          (Rows / 2 - row + this.squaresGap) * this.gridSize,

          0
        );
      }
    }
  }

  setMapAfterPutInGrid(arr: number[][], Rows: number, Columns: number) {
    for (let row = 0; row < Rows; row++)
      for (let col = 0; col < Columns; col++) {
        if (arr[row][col] > 0) {
          this.gridBackground[row][col].getComponent(Sprite).spriteFrame =
            this.squareColorFrames[arr[row][col] - 1];
        }
      }
  }

  updateGridAfterEat(arr: number[][], Rows: number, Columns: number) {
    for (let row = 0; row < Rows; row++)
      for (let col = 0; col < Columns; col++) {
        if (arr[row][col] === 0) {
          this.gridBackground[row][col].getComponent(Sprite).spriteFrame =
            this.squareColorFrames[8];
        }
      }
  }

  handleDarkModeBtn() {
    console.log("mode", this.darkMode);
    if (!this.darkMode) {
      this.lightOn.active = false;
      this.lightOff.active = true;

      this.topBackGround.color = color(0, 0, 0, 255);
      this.backGround.color = color(0, 0, 0, 255);
    } else {
      this.lightOn.active = true;
      this.lightOff.active = false;

      this.topBackGround.color = color(255, 255, 255, 255);
      this.backGround.color = color(255, 255, 255, 255);
    }
    this.darkMode = this.darkMode ? false : true;
  }

  handleCheckVolumeBtn() {
    // this.checkVolume = this.music.getVol() === 1 ? 0 : 1;

    this.checkVolume = this.audio.volume === 1 ? 0 : 1;
    if (this.checkVolume === 1) {
      this.volumeOn.active = true;
      this.volumeOff.active = false;
    } else {
      this.volumeOn.active = false;
      this.volumeOff.active = true;
    }

    this.audio.volume = this.checkVolume;
  }
}

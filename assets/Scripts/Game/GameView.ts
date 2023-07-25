import {
  _decorator,
  Animation,
  AudioSource,
  color,
  Component,
  director,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  sys,
  Vec3,
} from "cc";
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
  private layout: Sprite | null = null;

  @property({ type: Sprite })
  private backGround: Sprite | null = null;

  @property({ type: Node })
  private gameOverPopUp: Node | null = null;

  @property({ type: Node })
  private shapeContainer: Node[] = [];

  @property({ type: SpriteFrame })
  private squareColorFrames: SpriteFrame[] = [];

  @property({ type: Label })
  private currentScoreLb: Label | null = null;

  @property({ type: Label })
  private highScoreLb: Label | null = null;

  @property({ type: Label })
  private currentScoreLbPop: Label | null = null;

  @property({ type: Label })
  private highScoreLbPop: Label | null = null;

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
  private highScore: number = 0;

  protected start(): void {
    this.readLocalStorage();
  }

  private readLocalStorage(): void {
    this.darkMode = JSON.parse(sys.localStorage.getItem("statusMode1010"));

    // read and check highScore
    this.highScore = JSON.parse(sys.localStorage.getItem("highScore1010"));
    if (this.highScore === 0 || this.highScore === null) {
      sys.localStorage.setItem("highScore1010", JSON.stringify(this.highScore));
    } else {
      this.highScore = JSON.parse(sys.localStorage.getItem("highScore1010"));
      this.highScoreLb.string = `Best score: ${this.highScore}`;
    }

    this.checkVolume = JSON.parse(
      sys.localStorage.getItem("statusCheckVol1010")
    );

    this.checkChangeScenes();
  }

  private checkChangeScenes(): void {
    if (this.darkMode) {
      this.lightOn.active = false;
      this.lightOff.active = true;

      this.topBackGround.color = color(0, 0, 0, 255);
      this.backGround.color = color(0, 0, 0, 255);
      this.layout.color = color(0, 0, 0, 255);
    } else {
      this.lightOn.active = true;
      this.lightOff.active = false;

      this.topBackGround.color = color(255, 255, 255, 255);
      this.backGround.color = color(255, 255, 255, 255);
      this.layout.color = color(255, 255, 255, 128);
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
            this.squareColorFrames[5];
        }
      }
  }

  handleDarkModeBtn() {
    if (!this.darkMode) {
      this.lightOn.active = false;
      this.lightOff.active = true;

      this.topBackGround.color = color(0, 0, 0, 255);
      this.backGround.color = color(0, 0, 0, 255);
      this.layout.color = color(0, 0, 0, 255);
    } else {
      this.lightOn.active = true;
      this.lightOff.active = false;

      this.topBackGround.color = color(255, 255, 255, 255);
      this.backGround.color = color(255, 255, 255, 255);
      this.layout.color = color(255, 255, 255, 128);
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

  showResult(curSc: number) {
    if (curSc > this.highScore) {
      this.highScoreLb.string = `Best score: ${curSc}`;
      this.currentScoreLb.string = `${curSc}`;

      sys.localStorage.setItem("highScore1010", JSON.stringify(curSc));
    } else {
      this.currentScoreLb.string = `${curSc}`;
    }
  }

  gameOver(curSc: number): void {
    this.gameOverPopUp.setPosition(0, 0, 0);
    this.gameOverPopUp.getComponent(Animation).play();

    this.currentScoreLbPop.string = `${curSc}`;

    this.readLocalStorage();

    console.log(this.highScore);
    this.highScoreLbPop.string = `Best score: ${this.highScore}`;
  }
}

import {
  _decorator,
  Animation,
  AudioSource,
  color,
  Component,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  sys,
  Vec3,
  find,
} from "cc";
import { StoreAPI } from "../Data/StoreAPI";
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

  private gameClient;

  private squaresGap: number = -0.5;
  private gridSize: number = 50;
  private darkMode: boolean;
  private checkVolume: number;
  private highScore: number = 0;

  protected start(): void {
    let parameters = find("GameClient");
    let gameClientParams = parameters.getComponent(StoreAPI);

    this.gameClient = gameClientParams.gameClient;
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

  saveStatusMode(modeOn: boolean) {
    sys.localStorage.setItem("statusMode1010", JSON.stringify(modeOn));
  }

  saveStatusVol(checkVol: number) {
    sys.localStorage.setItem("statusCheckVol1010", JSON.stringify(checkVol));
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
    this.saveStatusMode(this.darkMode);
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
    this.saveStatusVol(this.checkVolume);
  }

  showResultInPlay(curSc: number) {
    if (curSc > this.highScore) {
      this.highScoreLb.string = `Best score: ${curSc}`;
      this.currentScoreLb.string = `${curSc}`;

      sys.localStorage.setItem("highScore1010", JSON.stringify(curSc));
    } else {
      this.currentScoreLb.string = `${curSc}`;
    }
  }

  async gameOver(curSc: number, id: string): Promise<void> {
    this.gameOverPopUp.active = true;

    let _this = this;
    this.readLocalStorage();

    this.gameOverPopUp.getComponent(Animation).play();

    this.currentScoreLbPop.string = `${curSc}`;
    this.highScoreLbPop.string = `Best score: ${this.highScore}`;

    await this.gameClient.match
      .completeMatch(id, {
        score: curSc,
      })
      .then((data) => {
        console.log(curSc);
      })
      .catch((error) => console.log(error));
  }

  animPoint(curSc: number, countBlock: number) {
    let tmp = 0;
    let time: number = 0;
    let lb = this.currentScoreLb;
    let start = parseInt(lb.string);

    if (countBlock < 3) {
      time = 150 / 3;
    } else {
      time = 150 / countBlock;
    }

    const inter = setInterval(doInter, time);

    function doInter() {
      lb.string = `${Math.floor(start + 1)}`;
      start++;
      tmp++;

      if (start === curSc) {
        clearInterval(inter);
      }
    }
  }

  animEat(row: number, col: number) {
    this.gridBackground[row][col].getComponent(Animation).play();
  }
}

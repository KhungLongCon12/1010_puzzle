import {
  _decorator,
  Component,
  director,
  instantiate,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameView")
export class GameView extends Component {
  @property({ type: Node })
  private gridNode: Node | null = null;

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

  protected start(): void {
    this.readLocalStorage();
  }

  private readLocalStorage(): void {
    console.log("read");
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

  handleReplayBtn() {
    director.loadScene("GamePlay");
  }

  handleDarkModeBtn() {
    console.log("Dark Mode");
  }

  handleCheckVolumeBtn() {
    console.log("check vol");
  }
}

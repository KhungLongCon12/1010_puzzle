import { _decorator, Camera, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameModel")
export class GameModel extends Component {
  @property({ type: Camera })
  private camera: Camera;

  @property({ type: Prefab })
  private gridSquare: Prefab;

  @property({ type: Prefab })
  private square: Prefab;

  @property({ type: Prefab })
  private shadowBlock: Prefab;

  private columns: number = 10;
  private rows: number = 10;
  // private highScore: number = 0;
  // private curScore: number = 0;

  public get Camera(): Camera {
    return this.camera;
  }
  public set Camera(camera: Camera) {
    this.camera = camera;
  }

  public get GridSquare(): Prefab {
    return this.gridSquare;
  }
  public set GridSquare(gridSq: Prefab) {
    this.gridSquare = gridSq;
  }

  public get Square(): Prefab {
    return this.square;
  }
  public set Square(square: Prefab) {
    this.square = square;
  }

  public get ShadowBlock(): Prefab {
    return this.shadowBlock;
  }
  public set ShadowBlock(shadow: Prefab) {
    this.shadowBlock = shadow;
  }

  public get Columns(): number {
    return this.columns;
  }
  public set Columns(col: number) {
    this.columns = col;
  }

  public get Rows(): number {
    return this.rows;
  }
  public set Rows(row: number) {
    this.rows = row;
  }

  // public get HighScore(): number {
  //   return this.highScore;
  // }
  // public set HighScore(v: number) {
  //   this.highScore = v;
  // }

  // public get CurScore(): number {
  //   return this.curScore;
  // }
  // public set CurScore(v: number) {
  //   this.curScore = v;
  // }
}

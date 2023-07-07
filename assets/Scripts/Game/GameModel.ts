import { _decorator, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameModel")
export class GameModel extends Component {
  @property({ type: Prefab })
  private gridSquare: Prefab;

  private columns: number = 10;
  private rows: number = 10;

  public get GridSquare(): Prefab {
    return this.gridSquare;
  }

  public set GridSquare(gridSq: Prefab) {
    this.gridSquare = gridSq;
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
}

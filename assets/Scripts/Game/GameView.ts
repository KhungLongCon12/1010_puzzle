import { _decorator, Component, Node, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameView")
export class GameView extends Component {
  @property({ type: Node })
  private gridNode: Node | null = null;

  @property({ type: Node })
  private shapeStore: Node | null = null;

  @property({ type: SpriteFrame })
  private squareFrames: SpriteFrame[] = [];

  public get GridNode(): Node {
    return this.gridNode;
  }
  public set GridNode(gridNode: Node) {
    this.gridNode = gridNode;
  }

  public get ShapeStore(): Node {
    return this.shapeStore;
  }
  public set ShapeStore(shapeStore: Node) {
    this.shapeStore = shapeStore;
  }

  public get SquareFrames(): SpriteFrame[] {
    return this.squareFrames;
  }
  public set SquareFrames(squareFrames: SpriteFrame[]) {
    this.squareFrames = squareFrames;
  }
}

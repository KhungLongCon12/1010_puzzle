import { _decorator, Component, Node, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameView")
export class GameView extends Component {
  @property({ type: Node })
  private gridNode: Node | null = null;

  @property({ type: Node })
  private shapeContainer: Node[] = [];

  @property({ type: SpriteFrame })
  private squareColorFrames: SpriteFrame[] = [];

  public get GridNode(): Node {
    return this.gridNode;
  }
  public set GridNode(gridNode: Node) {
    this.gridNode = gridNode;
  }

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
}

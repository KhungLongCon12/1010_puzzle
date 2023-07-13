import {
  _decorator,
  Component,
  CurveRange,
  EventTouch,
  instantiate,
  Node,
  Prefab,
  randomRangeInt,
  Sprite,
  v3,
  Vec2,
  Vec3,
} from "cc";
import { GameModel } from "./GameModel";
import { GameView } from "./GameView";
import { ShapeData } from "../Data/ShapeData";
const { ccclass, property } = _decorator;

@ccclass("GameControl")
export class GameControl extends Component {
  @property({ type: GameModel })
  private model: GameModel;

  @property({ type: GameView })
  private view: GameView;

  @property({ type: Node })
  private shapeContainer: Node;

  private shadowBlock: Node | null = null;

  private squaresGap: number = -0.5;
  private gridSize: number = 50;
  private blockIndex: number = 0;
  private randType: number;
  private randTypeColor: number;
  private randBlock: number;

  private isMoving: boolean = false;

  private squarePiecePos: Vec2 = new Vec2(0, 0);
  private startBlockPos: Vec3 = new Vec3(0, 0, 0);

  protected start(): void {
    this.createGrid();
    this.initListener();
    this.spawnNewBlock();
  }

  createGrid() {
    this.spawnGridSquares();
  }

  private initListener(): void {
    const selectedNodes = this.view.ShapeContainer.slice(0, 3);
    selectedNodes.forEach((node) => (node.active = true));
    selectedNodes.forEach((node) => {
      node.on(
        Node.EventType.TOUCH_START,
        (event) => {
          this.onTouchStart(event, node);
        },
        this
      );

      node.on(
        Node.EventType.TOUCH_MOVE,
        (event) => {
          this.onTouchMove(event, node);
        },
        this
      );

      node.on(
        Node.EventType.TOUCH_END,
        (event) => {
          this.onTouchEnd(event, node);
        },
        this
      );
    });
  }

  private onTouchStart(event: EventTouch, node?: Node): void {
    this.startBlockPos = node.position.clone();
    this.isMoving = true;
    node.setScale(2, 2);

    this.createShadowBox(node, event);
  }

  private onTouchMove(event: EventTouch, node?: Node) {
    if (this.isMoving === true) {
      node.position = this.getLocation(event);
      this.updateShadowBlockPos(node);
    }
  }

  private onTouchEnd(event: EventTouch, node?: Node) {
    this.isMoving = false;
    node.setScale(1, 1);
    node.position = new Vec3(this.startBlockPos);

    this.destroyShadowBlock();
  }

  //get Location Mouse
  private getLocation(event: EventTouch): Vec3 {
    let location = this.model.Camera.screenToWorld(
      new Vec3(event.getLocation().x, event.getLocation().y, 0)
    );

    let v3: Vec3 = new Vec3();

    this.shapeContainer.inverseTransformPoint(
      v3,
      new Vec3(location.x, location.y)
    );

    return v3;
  }

  // create BackGround
  spawnGridSquares() {
    for (let row = 0; row < this.model.Rows; ++row) {
      for (let column = 0; column < this.model.Columns; ++column) {
        const newGridSquare = instantiate(this.model.GridSquare);
        console.log("getPos", newGridSquare.position);

        this.view.GridNode.addChild(newGridSquare);
        newGridSquare.position = new Vec3(
          (-this.model.Rows / 2 + row + this.squaresGap) * this.gridSize,
          (-this.model.Columns / 2 + column + this.squaresGap) * this.gridSize,
          0
        );
      }
    }
  }

  getRandomBlock() {
    this.randType = randomRangeInt(1, 6);
    let max = ShapeData[this.randType - 1].shapes.length - 1;
    this.randTypeColor = randomRangeInt(0, 7);
    this.randBlock = randomRangeInt(0, max);
  }

  spawnNewBlock() {
    for (let i = 0; i < this.view.ShapeContainer.length; i++) {
      console.log(this.view.ShapeContainer.length);
      this.getRandomBlock();
      switch (this.randType) {
        case 1:
          this.setSquarePos();
          break;
        case 2:
          this.setSquarePos();
          break;
        case 3:
          this.setSquarePos();
          break;
        case 4:
          this.setSquarePos();
          break;
        case 5:
          this.setSquarePos();
          break;
        case 6:
          this.setSquarePos();
          break;
      }
      this.blockIndex++;
    }
  }

  private createBlockFromShape(arr: number): void {
    switch (arr) {
      case 0:
        break;
      case 1:
        const colorSp = this.view.SquareColorFrames[this.randTypeColor];
        const newBlock = instantiate(this.model.Square);
        newBlock.getComponent(Sprite).spriteFrame = colorSp;

        this.view.ShapeContainer[this.blockIndex].addChild(newBlock);

        newBlock.setPosition(this.squarePiecePos.x, this.squarePiecePos.y, 0);
        break;
      default:
        break;
    }
  }

  // get ShapeData to initiate block
  private setSquarePos(): void {
    for (let j = 0; j < 5; j++) {
      if (j === 0) {
        this.squarePiecePos.y = 40;
      }

      for (let i = 0; i < 5; i++) {
        if (i === 0) {
          this.squarePiecePos.x = -40;
        }
        this.createBlockFromShape(
          ShapeData[this.randType - 1].shapes[this.randBlock][j][i]
        );
        this.squarePiecePos.x += 25;
      }

      this.squarePiecePos.y -= 25;
    }
  }

  createShadowBox(block: Node, event?: EventTouch): void {
    this.shadowBlock = instantiate(this.model.ShadowBlock);
    this.shapeContainer.addChild(this.shadowBlock);

    this.shadowBlock.position = new Vec3(block.position);
    this.shadowBlock.position = this.getLocation(event);
    this.shadowBlock.setScale(0.8, 0.8);

    this.updateShadowBlockPos(block);
  }

  destroyShadowBlock(): void {
    if (this.shadowBlock) {
      this.shadowBlock.destroy();
      this.shadowBlock = null;
    }
  }

  updateShadowBlockPos(block: Node): void {
    if (this.shadowBlock) {
      this.shadowBlock.position = block.position
        .clone()
        .add(new Vec3(0, -50, 0));
    }
  }
}

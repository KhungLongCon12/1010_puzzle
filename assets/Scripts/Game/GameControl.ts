import {
  _decorator,
  Component,
  EventMouse,
  EventTouch,
  instantiate,
  Node,
  randomRangeInt,
  Sprite,
  SpriteFrame,
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
  private newBlock: Node | null;
  private curBlock: Node | null = null;

  private currentSprite: SpriteFrame | null;

  private gridMap: (number | null)[][] = [];
  private arrNewBlock: number[][][] = [];
  private activeBlock: Node[] = [];

  private remainingBlocks: number = 0;
  private blockIndex: number = 0;
  private indexBlock: number;
  private randType: number;
  private randTypeColor: number;
  private randBlock: number;

  private isMoving: boolean = false;
  private isShapeMoved: boolean = false;

  private squarePiecePos: Vec2 = new Vec2(0, 0);
  private startBlockPos: Vec3 = new Vec3(0, 0, 0);
  private mousePos: Vec3 = new Vec3(0, 0, 0);

  protected start(): void {
    this.createGrid();
    this.initListener();
    this.spawnNewBlock();
    this.initMap();
  }

  createGrid() {
    this.view.spawnGridSquares(
      this.model.GridSquare,
      this.model.Rows,
      this.model.Columns
    );
  }

  private initMap() {
    for (let row = 0; row < this.model.Rows; row++) {
      this.gridMap.push([]);
      for (let col = 0; col < this.model.Columns; col++) {
        this.gridMap[row].push(0);
      }
    }
  }

  private initListener(): void {
    const selectedNodes = this.view.ShapeContainer.slice(0, 3);

    selectedNodes.forEach((node) => {
      node.active = true;
    });

    selectedNodes.forEach((node, index) => {
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
          this.onTouchEnd(event, node, index);
        },
        this
      );
    });

    this.shapeContainer.on(
      Node.EventType.MOUSE_UP,
      (event) => {
        this.putArrayIntoMapGrid(event);
      },
      this.shapeContainer
    );
  }

  private onTouchStart(event: EventTouch, node: Node): void {
    this.startBlockPos = node.position.clone();
    this.isMoving = true;
    node.setScale(2, 2);

    this.getCurrentColorSpriteWhenClick(node);

    // this.createShadowBox(node, event);
  }

  private onTouchMove(event: EventTouch, node: Node) {
    if (this.isMoving === true) {
      node.position = this.getLocation(event);
      // this.updateShadowBlockPos(node);

      this.isShapeMoved = true;
    }
  }

  private onTouchEnd(event: EventTouch, node: Node, index: number) {
    this.indexBlock = index;
    this.isMoving = false;

    node.setScale(1, 1);
    node.position = new Vec3(this.startBlockPos);

    // this.destroyShadowBlock();
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

    console.log("check Move", v3);

    return v3;
  }

  getRandomBlock() {
    this.randType = randomRangeInt(1, 6);
    let max = ShapeData[this.randType - 1].shapes.length - 1;
    this.randTypeColor = randomRangeInt(0, 7);
    this.randBlock = randomRangeInt(0, max);
  }

  spawnNewBlock() {
    for (let i = 0; i < this.view.ShapeContainer.length; i++) {
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

    this.remainingBlocks = this.view.ShapeContainer.length;
  }

  private createBlockFromShape(arr: number): void {
    switch (arr) {
      case 0:
        break;
      case 1:
        const colorSp = this.view.SquareColorFrames[this.randTypeColor];
        this.newBlock = instantiate(this.model.Square);

        this.newBlock.getComponent(Sprite).spriteFrame = colorSp;
        this.newBlock.setPosition(
          this.squarePiecePos.x,
          this.squarePiecePos.y,
          0
        );
        this.view.ShapeContainer[this.blockIndex].addChild(this.newBlock);
        break;
      default:
        break;
    }
  }

  // get ShapeData to initiate block
  private setSquarePos(): void {
    this.arrNewBlock.push(ShapeData[this.randType - 1].shapes[this.randBlock]);

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

  // createShadowBox(block: Node, event?: EventTouch): void {
  //   this.shadowBlock = instantiate(this.model.ShadowBlock);
  //   this.shapeContainer.addChild(this.shadowBlock);

  //   this.shadowBlock.position = new Vec3(block.position);
  //   this.shadowBlock.position = this.getLocation(event);
  //   this.shadowBlock.setScale(0.8, 0.8);

  //   this.updateShadowBlockPos(block);
  // }

  // destroyShadowBlock(): void {
  //   if (this.shadowBlock) {
  //     this.shadowBlock.destroy();
  //     this.shadowBlock = null;
  //   }
  // }

  // updateShadowBlockPos(block: Node): void {
  //   if (this.shadowBlock) {
  //     this.shadowBlock.position = block.position
  //       .clone()
  //       .add(new Vec3(0, -50, 0));
  //   }
  // }

  private putArrayIntoMapGrid(event: EventMouse) {
    if (this.isShapeMoved) {
      this.mousePos = this.model.Camera.screenToWorld(
        new Vec3(event.getLocation().x, event.getLocation().y, 0)
      );

      let newPos = new Vec3();

      newPos = this.shapeContainer.inverseTransformPoint(newPos, this.mousePos);

      let x = Math.floor((newPos.x + 500 / 2) / 50) + 1;
      let y = -Math.floor((newPos.y - 500 / 2) / 50) - 2;

      this.checkBlock(y, x);

      console.log(x, y);
    }

    this.isShapeMoved = false;
  }

  private checkBlock(x: number, y: number) {
    let a: number = 0;
    let b: number = 0;

    let temp: number[][] = this.gridMap;

    for (let i = x - 2; i < x + 2; i++) {
      b = 0;
      for (let j = y - 2; j < y + 2; j++) {
        if (i < 0 || j < 0 || i > 9 || j > 9) {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            return;
          }
        } else {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            if (temp[i][j] === 0) {
              temp[i][j] = 1;
            } else return;
          }
        }

        b++;
      }
      a++;
    }
    this.gridMap = temp;
    console.log("array grid ->", this.gridMap);

    this.view.setMapAfterPutInGrid(
      temp,
      this.model.Rows,
      this.model.Columns,
      this.currentSprite
    );

    if (this.curBlock) {
      this.curBlock.destroy();
      this.curBlock = null;
      this.activeBlock.splice(this.activeBlock.indexOf(this.curBlock), 1);
      this.remainingBlocks--;

      if (this.remainingBlocks === 0) {
        this.spawnNewBlock();
      }
    }
  }

  getCurrentColorSpriteWhenClick(node: Node) {
    this.currentSprite = node
      .getChildByName("ShapePiece")
      .getComponent(Sprite).spriteFrame;
  }
}

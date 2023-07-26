import {
  _decorator,
  Component,
  director,
  EventMouse,
  EventTouch,
  find,
  instantiate,
  Node,
  randomRangeInt,
  Sprite,
  TweenSystem,
  Vec2,
  Vec3,
} from "cc";
import { GameModel } from "./GameModel";
import { GameView } from "./GameView";
import { ShapeData } from "../Data/ShapeData";
import { MusicGame } from "./MusicGame";
import { StoreAPI } from "../Data/StoreAPI";
const { ccclass, property } = _decorator;

let matchId: string;

@ccclass("GameControl")
export class GameControl extends Component {
  @property({ type: GameModel })
  private model: GameModel;

  @property({ type: GameView })
  private view: GameView;

  @property({ type: MusicGame })
  private music: MusicGame;

  @property({ type: Node })
  private shapeContainer: Node;

  private gameClient;

  private newBlock: Node | null;

  private gridMap: (number | null)[][] = [];
  private gridMapColor: (number | null)[][] = [];
  private arrNewBlock: number[][][] = [];
  private statusBlock: boolean[] = [true, true, true];

  private remainingBlocks: number = 0;
  private blockIndex: number = 0;
  private indexBlock: number;
  private randType: number;
  private randTypeColor: number;
  private randBlock: number;
  private curIndexSprite: number = 0;
  private countBlockInShapes: number = 0;
  private sumPoint: number = 0;

  private isMoving: boolean = false;
  private isShapeMoved: boolean = false;
  private isSpawn: boolean = false;

  private squarePiecePos: Vec2 = new Vec2(0, 0);
  private startBlockPos: Vec3 = new Vec3(0, 0, 0);
  private mousePos: Vec3 = new Vec3(0, 0, 0);

  // API call
  protected async onLoad(): Promise<void> {
    let _this = this;
    let parameters = find("GameClient");
    let gameClientParams = parameters.getComponent(StoreAPI);
    // if (DEBUG === false) {

    // }
    this.gameClient = gameClientParams.gameClient;
    console.log("khoi tao", matchId);

    if (matchId === undefined) {
      console.log("new");
      matchId = gameClientParams.matchId;
      console.log(matchId);
    }
  }

  protected start(): void {
    this.startGame();
  }

  private startGame(): void {
    const indexSound = randomRangeInt(0, 1);
    this.createGrid();
    this.initListener();
    this.spawnNewBlock();
    this.initMap();

    if (indexSound === 1) {
      this.music.onAudioQueue(1);
    } else {
      this.music.onAudioQueue(0);
    }
  }

  private createGrid(): void {
    this.view.spawnGridSquares(
      this.model.GridSquare,
      this.model.Rows,
      this.model.Columns
    );
  }

  protected update(dt: number): void {
    if (this.remainingBlocks === 3) {
      this.isSpawn = true;
      this.spawnNewBlockAfterUsed();
    }

    TweenSystem.instance.update(dt); // make anim smoother
  }

  private initMap(): void {
    for (let row = 0; row < this.model.Rows; row++) {
      this.gridMap.push([]);
      this.gridMapColor.push([]);
      for (let col = 0; col < this.model.Columns; col++) {
        this.gridMap[row].push(0);
        this.gridMapColor[row].push(0);
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
          if (this.statusBlock[index]) this.onTouchStart(event, node);
        },
        this
      );

      node.on(
        Node.EventType.TOUCH_MOVE,
        (event) => {
          if (this.statusBlock[index]) this.onTouchMove(event, node);
        },
        this
      );

      node.on(
        Node.EventType.TOUCH_END,
        (event) => {
          if (this.statusBlock[index]) this.onTouchEnd(event, node, index);

          this.putArrayIntoMapGrid(event);
        },
        this
      );
    });
  }

  private disableInteractShapes() {
    const selectedNodes = this.view.ShapeContainer.slice(0, 3);

    selectedNodes.forEach((node) => {
      node.active = false;
    });
  }

  private onTouchStart(event: EventTouch, node: Node): void {
    this.startBlockPos = node.position.clone();
    this.isMoving = true;
    node.setScale(2, 2);

    this.curIndexSprite = parseInt(node.children[0].name) + 1;
  }

  private onTouchMove(event: EventTouch, node: Node) {
    if (this.isMoving === true) {
      node.position = this.getLocation(event);

      this.countBlockInShapes = node.children.length;
      this.isShapeMoved = true;
    }
  }

  private onTouchEnd(event: EventTouch, node: Node, index: number): void {
    this.indexBlock = index;
    this.isMoving = false;

    node.setScale(1, 1);
    node.position = new Vec3(this.startBlockPos);
  }

  //get Location Mouse
  private getLocation(event: EventTouch): Vec3 {
    let location = this.model.Camera.screenToWorld(
      new Vec3(event.getLocation().x, event.getLocation().y, 0)
    );

    let v3: Vec3 = new Vec3();

    this.shapeContainer.inverseTransformPoint(
      v3,
      new Vec3(location.x + 25, location.y + 25)
    );

    return v3;
  }

  private getRandomBlock(): void {
    this.randType = randomRangeInt(1, 5);

    let max = ShapeData[this.randType - 1].shapes.length - 1; // get children array

    this.randBlock = randomRangeInt(0, max);

    this.randTypeColor = randomRangeInt(0, 5);
  }

  private spawnNewBlock(): void {
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

        this.newBlock = instantiate(this.model.Square);
        this.newBlock.name = this.randTypeColor.toString();
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

  private putArrayIntoMapGrid(event: EventMouse): void {
    if (this.isShapeMoved) {
      let newPos = new Vec3();

      this.mousePos = this.model.Camera.screenToWorld(
        new Vec3(event.getLocation().x, event.getLocation().y, 0)
      );

      newPos = this.shapeContainer.inverseTransformPoint(newPos, this.mousePos);

      let x = Math.floor((newPos.x + 500 / 2) / 50) + 1;
      let y = -Math.floor((newPos.y - 500 / 2) / 50) - 2;

      this.checkBlock(y, x);

      this.view.showResult(this.sumPoint);
    }

    // Deleted color in grid
    this.view.updateGridAfterEat(
      this.gridMapColor,
      this.model.Rows,
      this.model.Columns
    );

    this.isShapeMoved = false;
  }

  private checkBlock(x: number, y: number): void {
    let a: number = 0;
    let b: number = 0;

    let temp: number[][] = this.gridMap;
    let tempColor: number[][] = this.gridMapColor;

    for (let i = x - 2; i <= x + 2; i++) {
      b = 0;
      for (let j = y - 2; j <= y + 2; j++) {
        if (i < 0 || j < 0 || i > 9 || j > 9) {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            return;
          }
        } else {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            if (temp[i][j] === 0 && tempColor[i][j] === 0) {
              temp[i][j] = 1;
              tempColor[i][j] = this.curIndexSprite;
            } else return;
          }
        }

        b++;
      }
      a++;
    }

    this.sumPoint += this.countBlockInShapes;
    this.view.ShapeContainer[this.indexBlock].removeAllChildren();

    this.statusBlock[this.indexBlock] = false;
    this.checkResetStatus();
    this.indexBlock = null;

    this.gridMap = temp;
    this.gridMapColor = tempColor;

    this.clearRowColum(temp);

    const lose = this.checkLose();
    if (lose) {
      console.log(matchId);
      this.disableInteractShapes();
      this.scheduleOnce(() => {
        this.view.gameOver(this.sumPoint, matchId);
      }, 1);
    }

    // show color in grid
    this.view.setMapAfterPutInGrid(
      tempColor,
      this.model.Rows,
      this.model.Columns
    );

    this.remainingBlocks++;
  }

  private clearRowColum(arr: number[][]): void {
    const size = this.gridMap.length;
    let clearedRowsCount: number = 0;
    let clearedColumnsCount: number = 0;
    let comboEat: number = 0;

    let clearRow: Array<boolean> = [];
    let clearCol: Array<boolean> = [];

    for (let row = size - 1; row >= 0; row--) {
      let temp = false;
      if (this.isRowFull(row)) {
        clearedRowsCount++;
        temp = true;
      }
      clearRow.push(temp);
    }

    for (let col = size - 1; col >= 0; col--) {
      let temp = false;
      if (this.isColumnFull(col)) {
        clearedColumnsCount++;
        temp = true;
      }
      clearCol.push(temp);
    }

    for (let i = 0; i < size; i++) {
      if (clearRow[i]) {
        this.clearRowAndColor(size - 1 - i);
      }
      if (clearCol[i]) {
        this.clearColumnAndColor(size - 1 - i);
      }
    }

    comboEat = clearedColumnsCount + clearedRowsCount;
    // this.view.animPoint(this.sumPoint, comboEat);
    this.makeCombo(comboEat, clearedRowsCount, clearedColumnsCount);
  }

  private isRowFull(row: number): boolean {
    const size = this.gridMap.length;

    for (let col = 0; col < size; col++) {
      if (this.gridMap[row][col] === 0 && this.gridMapColor[row][col] === 0) {
        return false;
      }
    }

    return true;
  }

  private isColumnFull(col: number): boolean {
    const size = this.gridMap.length;

    for (let row = 0; row < size; row++) {
      if (this.gridMap[row][col] === 0 && this.gridMapColor[row][col] === 0) {
        return false;
      }
    }

    return true;
  }

  // Function to clear a row
  private clearRowAndColor(row: number): void {
    const size = this.gridMap.length;
    const sizeColor = this.gridMapColor.length;

    for (let col = 0; col < size; col++) {
      this.gridMap[row][col] = 0; // Set the value to the desired empty or default value
    }

    for (let colColor = 0; colColor < sizeColor; colColor++) {
      this.gridMapColor[row][colColor] = 0;
    }
  }

  // Function to clear a column
  private clearColumnAndColor(col: number): void {
    const size = this.gridMap.length;
    const sizeColor = this.gridMapColor.length;

    for (let row = 0; row < size; row++) {
      this.gridMap[row][col] = 0; // Set the value to the desired empty or default value
    }

    for (let rowColor = 0; rowColor < sizeColor; rowColor++) {
      this.gridMapColor[rowColor][col] = 0;
    }
  }

  private spawnNewBlockAfterUsed() {
    if (this.isSpawn) {
      this.isSpawn = false;
      this.blockIndex = 0;
      this.arrNewBlock.length = 0;
      this.remainingBlocks = 0;

      this.spawnNewBlock();
    }
  }

  private async handleReplay(): Promise<void> {
    let parameters = find("GameClient");
    let gameClientParams = parameters.getComponent(StoreAPI);

    await gameClientParams.gameClient.match
      .startMatch()
      .then((data) => {
        matchId = data.matchId;
        gameClientParams.matchId = matchId;
        director.loadScene("GamePlay");
      })
      .catch((error) => console.log(error));
  }

  private makeCombo(combo: number, clearRow: number, clearCol: number): void {
    if (combo > 1) {
      this.sumPoint += combo * 10;
    } else if (clearRow === 1 || clearCol === 1) {
      let clear: number = clearCol + clearRow;
      this.sumPoint += clear * 10;
    }
  }

  private checkLose(): boolean {
    let count: number = 0;

    for (let i = 0; i < this.arrNewBlock.length; i++) {
      if (this.statusBlock[i]) {
        if (this.browseLose(i)) {
        } else {
          count++;
        }
      }
    }

    if (count > 0) {
      return false;
    }

    return true;
  }

  private browseLose(value: number): boolean {
    for (let i = 0; i < this.gridMap.length; i++) {
      for (let j = 0; j < this.gridMap.length; j++) {
        if (this.gridMap[i][j] === 0) {
          if (this.checkApprove(i, j, value)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private checkApprove(i: number, j: number, index: number): boolean {
    let a: number = 0;
    let b: number = 0;
    for (let k = i - 2; k <= i + 2; k++) {
      b = 0;
      for (let l = j - 2; l <= j + 2; l++) {
        if (k < 0 || l < 0 || k > 9 || l > 9) {
          if (this.arrNewBlock[index][a][b] === 1) {
            return false;
          }
        } else {
          if (this.arrNewBlock[index][a][b] === 1) {
            if (this.gridMap[k][l] !== 0) {
              return false;
            }
          }
        }
        b++;
      }
      a++;
    }
    return true;
  }

  private checkResetStatus() {
    for (let i = 0; i < this.statusBlock.length; i++) {
      if (this.statusBlock[i] === true) {
        return;
      }
    }
    this.statusBlock = [true, true, true];
  }
}

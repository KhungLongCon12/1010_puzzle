import {
  _decorator,
  Button,
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

  @property({ type: Button })
  private btnReplay: Button;

  private gameClient;

  private newBlock: Node | null;

  private gridMap: number[][] = [];
  private gridMapColor: number[][] = [];
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
  private clearedRowsCount: number = 0;
  private clearedColumnsCount: number = 0;

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

    this.gameClient = gameClientParams.gameClient;

    if (matchId === undefined) {
      matchId = gameClientParams.matchId;
    }
  }

  // onGame
  protected start(): void {
    this.startGame();
  }

  private startGame(): void {
    this.createGrid();
    this.initListener();
    this.spawnNewBlock();
    this.initMap();

    this.music.onAudioQueue();
  }

  private createGrid(): void {
    this.view.spawnGridSquares(
      this.model.GridSquare,
      this.model.Rows,
      this.model.Columns
    );
  }

  protected update(dt: number): void {
    TweenSystem.instance.update(dt); // make anim smoother

    if (this.remainingBlocks === 3) {
      this.isSpawn = true;
      this.spawnNewBlockAfterUsed();
    }
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
          if (this.statusBlock[index]) {
            this.onTouchStart(event, node);
          }
        },
        this
      );

      node.on(
        Node.EventType.TOUCH_MOVE,
        (event) => {
          if (this.statusBlock[index]) {
            this.onTouchMove(event, node);
          }
        },
        this
      );

      node.on(
        Node.EventType.TOUCH_END,
        (event) => {
          if (this.statusBlock[index]) {
            this.onTouchEnd(event, node, index);
          }

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
    const mousePos = this.getLocation(event);

    const mouse = this.model.Camera.screenToWorld(
      new Vec3(event.getLocation().x, event.getLocation().y, 0)
    );
    let newPos = new Vec3();
    newPos = this.shapeContainer.inverseTransformPoint(newPos, mouse);

    if (this.isMoving === true) {
      node.position = this.getLocation(event);

      this.countBlockInShapes = node.children.length;
      this.isShapeMoved = true;

      if (mouse.y > 620 || mouse.y < 20 || mouse.x < 10 || mouse.x > 950) {
        this.onTouchEnd(event, node);
      }
    }
  }

  private onTouchEnd(event: EventTouch, node: Node, index?: number): void {
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

      let x = Math.floor((newPos.x + 525 / 2) / 50) + 1;
      let y = -Math.floor((newPos.y - 525 / 2) / 50) - 2;

      this.checkBlock(y, x);

      this.view.showResultInPlay(this.model.Score);
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

    let tempV2: Vec2[] = [];

    for (let i = x - 2; i <= x + 2; i++) {
      b = 0;
      for (let j = y - 2; j <= y + 2; j++) {
        if (i < 0 || j < 0 || i > 9 || j > 9) {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            return;
          }
        } else {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            if (this.gridMap[i][j] === 0 && this.gridMapColor[i][j] === 0) {
              tempV2.push(new Vec2(i, j));
            } else {
              return;
            }
          }
        }
        b++;
      }
      a++;
    }

    tempV2.map((item) => {
      this.gridMap[item.x][item.y] = 1;
      this.gridMapColor[item.x][item.y] = this.curIndexSprite;
    });

    this.view.ShapeContainer[this.indexBlock].removeAllChildren();

    this.statusBlock[this.indexBlock] = false;
    this.checkResetStatus();
    this.indexBlock = null;

    this.clearRowAndColum(temp);

    this.makeCombo(this.countBlockInShapes);

    const lose = this.checkLose();
    if (lose) {
      this.disableInteractShapes();
      this.scheduleOnce(() => {
        this.view.gameOver(this.model.Score, matchId);
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

  private clearRowAndColum(arr: number[][]): void {
    const size = this.gridMap.length;

    let clearRow: Array<boolean> = [];
    let clearCol: Array<boolean> = [];

    for (let row = size - 1; row >= 0; row--) {
      let temp: boolean = false;
      if (this.isRowFull(row)) {
        this.clearedRowsCount++;
        temp = true;
      }

      clearRow.push(temp);
    }

    for (let col = size - 1; col >= 0; col--) {
      let temp: boolean = false;
      if (this.isColumnFull(col)) {
        this.clearedColumnsCount++;
        temp = true;
      }

      clearCol.push(temp);
    }

    for (let i = 0; i < size; i++) {
      if (clearRow[i]) {
        this.clearRowAndColor(size - 1 - i);
        for (let j = 0; j < size; j++) {
          this.view.animEat(size - 1 - i, j);
        }
      }
      if (clearCol[i]) {
        this.clearColumnAndColor(size - 1 - i);
        for (let k = 0; k < size; k++) {
          this.view.animEat(k, size - 1 - i);
        }
      }
    }
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

    this.btnReplay.interactable = false;

    if (this.checkLose()) {
      await gameClientParams.gameClient.match
        .startMatch()
        .then((data) => {
          matchId = data.matchId;
          gameClientParams.matchId = matchId;
          director.loadScene("GamePlay");
        })
        .catch((error) => console.log(error));
    } else {
      director.loadScene("GamePlay");
    }
  }

  private makeCombo(blocks: number): void {
    let eatCombo: number = this.clearedRowsCount + this.clearedColumnsCount; // count how many row and col is ate
    let tmpCountBlock: number = blocks; // count block when take and put in grid
    let isFullRowOrCol: number = 10;

    if (eatCombo === 0) {
      this.model.Score += tmpCountBlock;
      this.view.animPoint(this.model.Score, tmpCountBlock);
    } else if (eatCombo === 1) {
      this.model.Score += isFullRowOrCol + tmpCountBlock;
      this.view.animPoint(this.model.Score, tmpCountBlock);
    } else if (eatCombo >= 2) {
      let tmpScore: number = 0;
      tmpScore = eatCombo * isFullRowOrCol + tmpCountBlock;

      this.model.Score += tmpScore;
      this.view.animPoint(this.model.Score, tmpCountBlock);
    }

    this.countBlockInShapes = 0;
    this.clearedColumnsCount = 0;
    this.clearedRowsCount = 0;
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

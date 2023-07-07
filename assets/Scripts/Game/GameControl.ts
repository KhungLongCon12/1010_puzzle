import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  Sprite,
  Vec2,
  Vec3,
} from "cc";
import { GameModel } from "./GameModel";
import { GameView } from "./GameView";
import { Block, ShapeData } from "../Data/ShapeData";
const { ccclass, property } = _decorator;

@ccclass("GameControl")
export class GameControl extends Component {
  @property({ type: GameModel })
  private model: GameModel;

  @property({ type: GameView })
  private view: GameView;

  private squaresGap: number = 5;
  private gridSize: number = 50;
  private squareScale: number = 1;

  private gridData = [
    {
      id: 1,
      squares: [1],
    },
    {
      id: 2,
      squares: [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
      ],
    },
  ];

  protected start(): void {
    this.createGrid();
  }

  createGrid() {
    this.spawnGridSquares();
    const randomBlocks = this.getRandomBlock();

    this.setSquarePos(randomBlocks);
  }

  spawnGridSquares() {
    let squareIndex: number = 0;

    for (let row = 0; row < this.model.Rows; ++row) {
      for (let column = 0; column < this.model.Columns; ++column) {
        console.log("run this");
        const newGridSquare = instantiate(this.model.GridSquare);
        this.view.GridNode.addChild(newGridSquare);
        newGridSquare.position = new Vec3(
          (-this.model.Rows / 2 + row + this.squaresGap) * this.gridSize,
          (-this.model.Columns / 2 + column + this.squaresGap) * this.gridSize,
          0
        );
        squareIndex++;
      }
    }
  }

  getRandomBlock() {
    const randomBlocks: Block[] = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * ShapeData.length);
      const randomBlockData = ShapeData[randomIndex];
      const randomBlock = new Block(randomBlockData.id, randomBlockData.shapes);

      randomBlocks.push(randomBlock);
    }
    return randomBlocks;
  }

  setSquarePos(blocks: Block[]): void {
    const blockSpacing = 100;
    const startPosX = -blockSpacing * 1.5;
    const startPosY = 0;

    for (let i = 0; i < blocks.length; i++) {
      console.log(blocks);
      const block = instantiate(this.model.GridSquare);
      block.setPosition(startPosX + i * blockSpacing, startPosY);

      const sprite = block.getComponent(Sprite);
      if (sprite && this.view.SquareFrames[i]) {
        sprite.spriteFrame = this.view.SquareFrames[i];
      }

      this.view.ShapeStore.addChild(block);
    }
  }
}
